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
