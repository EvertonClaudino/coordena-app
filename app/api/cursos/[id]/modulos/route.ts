import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ─── GET /api/cursos/[id]/modulos ────────────────────────────────────────────

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const modulos = await prisma.modulo.findMany({
      where: { cursoId: id },
      orderBy: { ordem: "asc" },
      select: { id: true, nome: true, ordem: true },
    });

    return NextResponse.json(modulos);
  } catch (error) {
    console.error("[GET /api/cursos/[id]/modulos]", error);
    return NextResponse.json(
      { error: "Erro ao carregar módulos" },
      { status: 500 },
    );
  }
}
