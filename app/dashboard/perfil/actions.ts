'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateFormadorPerfil(userId: string, especialidade: string, competencias: string) {
    try {
        console.log('🔍 updateFormadorPerfil chamada com:', { userId, especialidade, competencias })

        const formador = await prisma.formador.findUnique({
            where: { userId },
        })

        console.log('📊 Formador encontrado:', formador)

        if (!formador) {
            console.log('❌ Formador não encontrado para userId:', userId)
            return { sucesso: false, mensagem: 'Formador não encontrado' }
        }

        const resultado = await prisma.formador.update({
            where: { id: formador.id },
            data: { 
                especialidade,
                competencias,
            },
        })

        console.log('✅ Formador atualizado:', resultado)

        revalidatePath('/dashboard/perfil')
        return { sucesso: true, mensagem: 'Perfil actualizado com sucesso!' }
    } catch (erro) {
        console.error('❌ Erro em updateFormadorPerfil:', erro)
        return {
            sucesso: false,
            mensagem: erro instanceof Error ? erro.message : 'Erro ao actualizar perfil',
        }
    }
}
