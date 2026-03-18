import { prisma } from "@/lib/prisma";

export async function getFormadorStats(userId: string) {
    const formador = await prisma.formador.findUnique({
        where: { userId },
        include: { modulosLecionados: true },
    });

    if (!formador)
        return { modulosAtivos: 0, proximasSessoes: 0, convitesPendentes: 0 };

    const agora = new Date();

    const [proximasSessoes, convitesPendentes] = await Promise.all([
        prisma.aula.count({
            where: {
                formadorId: formador.id,
                dataHora: { gte: agora },
            },
        }),
        // placeholder para quando tiveres o modelo de convites
        Promise.resolve(0),
    ]);

    return {
        modulosAtivos: formador.modulosLecionados.length,
        proximasSessoes,
        convitesPendentes,
    };
}

export async function getProximasSessoesFormador(userId: string) {
    const formador = await prisma.formador.findUnique({
        where: { userId },
    });

    if (!formador) return [];

    const agora = new Date();

    const aulas = await prisma.aula.findMany({
        where: {
            formadorId: formador.id,
            dataHora: { gte: agora },
        },
        orderBy: { dataHora: "asc" },
        take: 4,
        include: {
            modulo: { include: { curso: true } },
        },
    });

    return aulas.map((aula: (typeof aulas)[0]) => ({
        id: aula.id,
        titulo: `${aula.modulo.curso.nome} · ${aula.titulo}`,
        dataHora: aula.dataHora,
        duracao: aula.duracao,
    }));
}

export type SessaoFormador = Awaited<
    ReturnType<typeof getProximasSessoesFormador>
>[number];

export async function getConvitesPendentesFormador(userId: string) {
    const formador = await prisma.formador.findUnique({
        where: { userId },
    });

    if (!formador) return [];

    const convites = await prisma.convite.findMany({
        where: {
            formadorId: formador.id,
            status: 'PENDENTE',
        },
        orderBy: { dataEnvio: "desc" },
    });

    return convites.map((convite) => ({
        id: convite.id,
        descricao: convite.descricao || 'Sem descrição',
        dataEnvio: convite.dataEnvio,
    }));
}

export type ConvitePendente = Awaited<
    ReturnType<typeof getConvitesPendentesFormador>
>[number];

export async function getFormadorPerfil(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            formador: true,
        },
    });

    if (!user?.formador) return null;

    return {
        nome: user.nome || '',
        email: user.email || '',
        especialidade: user.formador.especialidade || '',
        competencias: user.formador.competencias || '',
        linkedin: user.formador.linkedin || '',
        github: user.formador.github || '',
        idioma: user.formador.idioma || '',
        nacionalidade: user.formador.nacionalidade || '',
        userId: user.id,
    };
}

/**
 * Fetches all modules assigned to a trainer (formador)
 * @param userId - The user ID of the trainer
 * @returns Array of assigned modules with course information and enrolled students
 */
export async function getModulosAtribuidosFormador(userId: string) {
    // Find the trainer by userId
    const formador = await prisma.formador.findUnique({
        where: { userId },
        include: {
            // Include the relationship between trainer and modules
            modulosLecionados: {
                include: {
                    // Include module details and course information with inscriptions
                    modulo: {
                        include: {
                            curso: true,
                            // Include all students inscribed in this course
                            aulas: {
                                include: {
                                    presencas: {
                                        include: {
                                            formando: {
                                                include: {
                                                    user: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    // Return empty array if trainer not found
    if (!formador) return [];

    // For each module, also get the inscriptions (students enrolled in the course)
    const modulosComFormandos = await Promise.all(
        formador.modulosLecionados.map(async (fm) => {
            // Get all students enrolled in this course
            const inscricoes = await prisma.inscricao.findMany({
                where: { cursoId: fm.modulo.curso.id },
                include: {
                    formando: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            return {
                id: fm.modulo.id,
                nome: fm.modulo.nome,
                // Generate a code from the module ID
                codigo: fm.modulo.id.substring(0, 8).toUpperCase(),
                // Get the course name
                curso: fm.modulo.curso.nome,
                // Tags - empty for now (can be expanded later)
                tags: [],
                // Get actual count of students from inscriptions
                formandos: inscricoes.length,
                // Default status is active
                status: 'Ativo' as const,
                // Add list of students enrolled in this course
                estudantes: inscricoes.map((insc) => ({
                    id: insc.formando.id,
                    nome: insc.formando.user.nome,
                    email: insc.formando.user.email,
                    dataInscricao: insc.dataInicio,
                })),
            };
        })
    );

    return modulosComFormandos;
}
