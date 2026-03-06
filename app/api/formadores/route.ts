import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const { nome, email } = await req.json()

        if (!nome || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            )
        }

        const userExistente = await prisma.user.findUnique({
            where: { email },
        })

        if (userExistente) {
            return NextResponse.json(
                { error: 'Email já está em uso' },
                { status: 400 }
            )
        }

        // Cria o user com senha temporária
        const senhaHash = "123456"

        const user = await prisma.user.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                role: 'FORMADOR',
                formador: { create: {} },
            },
            include: { formador: true },
        })

        // TODO: enviar email com senha temporária

        return NextResponse.json(
            {
                message: 'Formador criado com sucesso',
                formador: {
                    id: user.formador?.id,
                    nome: user.nome,
                    email: user.email,
                    senhaTemporaria: senhaHash, // remover quando tiveres email
                },
            },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}