import { prisma } from '@/lib/prisma'

export async function getFormadorStats(userId: string) {
    const formador = await prisma.formador.findUnique({
        where: { userId },
        include: { modulosLecionados: true },
    })

    if (!formador) return { modulosAtivos: 0, proximasSessoes: 0, convitesPendentes: 0, docsEmFalta: 0 }

    const agora = new Date()

    const [proximasSessoes, convitesPendentes, docsEmFalta] = await Promise.all([
        prisma.aula.count({
            where: {
                formadorId: formador.id,
                dataHora: { gte: agora },
            },
        }),
        prisma.convite.count({
            where: {
                formadorId: formador.id,
                status: 'PENDENTE',
            },
        }),
        prisma.documentoFormador.count({
            where: {
                formadorId: formador.id,
                status: 'EM_FALTA',
            },
        }),
    ])

    return {
        modulosAtivos: formador.modulosLecionados.length,
        proximasSessoes,
        convitesPendentes,
        docsEmFalta,
    }
}

export async function getProximasSessoesFormador(userId: string) {
    const formador = await prisma.formador.findUnique({
        where: { userId },
    })

    if (!formador) return []

    const agora = new Date()

    const aulas = await prisma.aula.findMany({
        where: {
            formadorId: formador.id,
            dataHora: { gte: agora },
        },
        orderBy: { dataHora: 'asc' },
        take: 4,
        include: {
            modulo: { include: { curso: true } },
        },
    })

    return aulas.map((aula: (typeof aulas)[0]) => ({
        id: aula.id,
        titulo: `${aula.modulo.curso.nome} · ${aula.titulo}`,
        dataHora: aula.dataHora,
        duracao: aula.duracao,
    }))
}

export async function getConvitesPendentesFormador(userId: string) {
    const formador = await prisma.formador.findUnique({
        where: { userId },
    })

    if (!formador) return []

    const convites = await prisma.convite.findMany({
        where: {
            formadorId: formador.id,
            status: 'PENDENTE',
        },
        orderBy: { dataEnvio: 'desc' },
        take: 5,
    })

    return convites.map((convite: (typeof convites)[0]) => ({
        id: convite.id,
        descricao: convite.descricao || 'Convite sem descrição',
        dataEnvio: convite.dataEnvio,
        status: convite.status,
    }))
}

export async function getDocsEmFaltaFormador(userId: string) {
    const formador = await prisma.formador.findUnique({
        where: { userId },
    })

    if (!formador) return []

    const documentos = await prisma.documentoFormador.findMany({
        where: {
            formadorId: formador.id,
            status: 'EM_FALTA',
        },
        orderBy: { createdAt: 'desc' },
    })

    return documentos.map((doc: (typeof documentos)[0]) => ({
        id: doc.id,
        tipo: doc.tipo,
        status: doc.status,
        dataExpiracao: doc.dataExpiracao,
    }))
}

export type SessaoFormador = Awaited<ReturnType<typeof getProximasSessoesFormador>>[number]
export type ConvitePendente = Awaited<ReturnType<typeof getConvitesPendentesFormador>>[number]
export type DocumentoEmFalta = Awaited<ReturnType<typeof getDocsEmFaltaFormador>>[number]