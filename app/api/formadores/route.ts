import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const formadores = await prisma.formador.findMany({
            include: {
                user: true,
            },
        });
        return NextResponse.json(formadores);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar formadores." },
            { status: 500 },
        );
    }
}
