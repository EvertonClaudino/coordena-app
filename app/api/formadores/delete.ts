import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json(
                { error: "ID obrigatório" },
                { status: 400 },
            );
        }
        // Elimina o formador e o utilizador associado
        await prisma.formador.delete({ where: { id } });
        // Opcional: eliminar o user
        // await prisma.user.delete({ where: { id: userId } });
        return NextResponse.json({ message: "Formador eliminado com sucesso" });
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao eliminar formador." },
            { status: 500 },
        );
    }
}
