import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  try {
    const { nome, descricao, dataInicio, dataFim, cargaHoraria } = await req.json()

    // Validação básica
    if (!nome || nome.trim() === '') {
      return Response.json(
        { error: 'Nome do curso é obrigatório' },
        { status: 400 }
      )
    }

    // Criar curso
    const curso = await prisma.curso.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        dataInicio: dataInicio ? new Date(dataInicio) : null,
        dataFim: dataFim ? new Date(dataFim) : null,
        cargaHoraria: parseInt(cargaHoraria) || 0,
        status: 'ATIVO',
      },
      include: {
        modulos: true,
        inscricoes: true,
      },
    })

    // Revalidar a página
    revalidatePath('/dashboard/cursos')

    return Response.json(
      {
        ...curso,
        formandos: curso.inscricoes.length,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar curso:', error)
    return Response.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    )
  }
}
