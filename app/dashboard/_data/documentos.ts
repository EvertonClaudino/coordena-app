import { calcularStatus, DocStatus } from '@/lib/documento-utils'
import { prisma } from '@/lib/prisma'

// ─── Constantes ───────────────────────────────────────────────────────────────

const DOCS_OBRIGATORIOS = [
    'CV', 'Cartão de Cidadão', 'CCP', 'IBAN',
    'Seguro', 'Registo Criminal', 'Certidão Finanças', 'Certidão Seg. Social',
]

// ─── Types ────────────────────────────────────────────────────────────────────

type DocumentoResult = {
    id: string | null
    nome: string
    status: DocStatus | 'EM_FALTA'
    dataValidade: Date | null
    dataEmissao: Date | null
    numero: string | null
}

// ─── Funções ──────────────────────────────────────────────────────────────────

export async function getFormadoresComDocumentos() {
    const formadores = await prisma.formador.findMany({
        include: {
            user: true,
            documentos: true,
        },
        orderBy: { user: { nome: 'asc' } },
    })

    return formadores.map((f: (typeof formadores)[0]) => {
        const documentos = DOCS_OBRIGATORIOS.map((nomeDoc): DocumentoResult => {
            const doc = f.documentos.find((d: (typeof f.documentos)[0]) => d.nome === nomeDoc)

            return {
                id: doc?.id ?? null,
                nome: nomeDoc,
                status: doc ? calcularStatus(doc.dataValidade) : 'EM_FALTA',
                dataValidade: doc?.dataValidade ?? null,
                dataEmissao: doc?.dataEmissao ?? null,
                numero: doc?.numero ?? null,
            }
        })

        return {
            id: f.id,
            userId: f.userId,
            nome: f.user.nome,
            email: f.user.email,
            documentos,
        }
    })
}

export async function getDocumentosFormador(userId: string): Promise<DocumentoResult[]> {
    const formador = await prisma.formador.findUnique({
        where: { userId },
        include: { documentos: true },
    })

    if (!formador) return []

    return DOCS_OBRIGATORIOS.map((nomeDoc): DocumentoResult => {
        const doc = formador.documentos.find(
            (d: (typeof formador.documentos)[0]) => d.nome === nomeDoc
        )

        return {
            id: doc?.id ?? null,
            nome: nomeDoc,
            status: doc ? calcularStatus(doc.dataValidade) : 'EM_FALTA',
            dataValidade: doc?.dataValidade ?? null,
            dataEmissao: doc?.dataEmissao ?? null,
            numero: doc?.numero ?? null,
        }
    })
}

// ─── Tipos exportados ─────────────────────────────────────────────────────────
export type FormadorComDocumentos = Awaited<ReturnType<typeof getFormadoresComDocumentos>>[number]
export type DocumentoFormador = DocumentoResult