import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 A preparar o seed da aplicação...')

    const password = await bcrypt.hash('123456', 10)

    // 1. Criar Coordenador
    const coordenadorUser = await prisma.user.upsert({
        where: { email: 'coordenador@teste.com' },
        update: {},
        create: {
            nome: 'Carlos Coordenador',
            email: 'coordenador@teste.com',
            senha: password,
            role: 'COORDENADOR',
            coordenador: { create: {} }
        },
        include: { coordenador: true }
    })
    const coordenadorId = coordenadorUser.coordenador!.id

    // 2. Criar Formador
    const formadorUser = await prisma.user.upsert({
        where: { email: 'formador@teste.com' },
        update: {},
        create: {
            nome: 'Marta Formadora',
            email: 'formador@teste.com',
            senha: password,
            role: 'FORMADOR',
            formador: { create: { especialidade: 'Fullstack Development' } }
        },
        include: { formador: true }
    })
    const formadorId = formadorUser.formador!.id

    // 3. Criar Formando
    const formandoUser = await prisma.user.upsert({
        where: { email: 'formando@teste.com' },
        update: {},
        create: {
            nome: 'André Aluno',
            email: 'formando@teste.com',
            senha: password,
            role: 'FORMANDO',
            formando: { create: {} }
        },
        include: { formando: true }
    })
    const formandoId = formandoUser.formando!.id

    // 4. Criar Curso vinculado ao Coordenador
    const curso = await prisma.curso.create({
        data: {
            nome: 'Bootcamp Web Premium',
            descricao: 'Um curso completo para testar todas as funcionalidades do sistema.',
            cargaHoraria: 400,
            status: 'ATIVO',
            dataInicio: new Date(),
            dataFim: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            coordenadorId: coordenadorId
        }
    })

    // 5. Criar Módulos vinculados ao Curso e ao Coordenador (Multi-tenancy)
    const modulo = await prisma.modulo.create({
        data: {
            nome: 'Introdução ao Next.js',
            descricao: 'Módulo prático sobre App Router e Server Actions.',
            ordem: 1,
            cargaHoraria: 60,
            cursoId: curso.id,
            coordenadorId: coordenadorId
        }
    })

    // 6. Associar Formador ao Módulo
    await prisma.formadorModulo.upsert({
        where: {
            formadorId_moduloId: {
                formadorId: formadorId,
                moduloId: modulo.id
            }
        },
        update: {},
        create: {
            formadorId: formadorId,
            moduloId: modulo.id
        }
    })

    // 7. Matricular Formando no Curso
    await prisma.inscricao.upsert({
        where: {
            formandoId_cursoId: {
                formandoId: formandoId,
                cursoId: curso.id
            }
        },
        update: {},
        create: {
            formandoId: formandoId,
            cursoId: curso.id,
            dataInicio: new Date()
        }
    })

    // 8. Criar Sessão no Calendário (Hoje)
    const hoje = new Date()
    hoje.setHours(14, 0, 0, 0)

    await prisma.aula.create({
        data: {
            titulo: 'Aula Inaugural: Setup do Ambiente',
            dataHora: hoje,
            duracao: 180,
            moduloId: modulo.id,
            formadorId: formadorId
        }
    })

    console.log('✅ Seed concluído com sucesso!')
    console.log('--- CREDENCIAIS DE ACESSO ---')
    console.log('Coordenador: coordenador@teste.com / 123456')
    console.log('Formador:    formador@teste.com    / 123456')
    console.log('Formando:    formando@teste.com    / 123456')
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })