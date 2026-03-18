import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Validation ───────────────────────────────────────────────────────────────

const AulaSchema = z.object({
  titulo: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
  dataHora: z.string(), // ISO string
  duracao: z.coerce.number().int().min(1, "A duração deve ser >= 1 minuto"),
  moduloId: z.string().uuid("moduloId inválido"),
  formadorId: z.string().uuid("formadorId inválido"),
});

// ─── GET /api/aulas ───────────────────────────────────────────────────────────

export async function GET() {
  try {
    const aulas = await prisma.aula.findMany({
      orderBy: { dataHora: "asc" },
      include: {
        modulo: {
          include: { curso: true },
        },
        formador: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json(aulas);
  } catch (error) {
    console.error("[GET /api/aulas]", error);
    return NextResponse.json(
      { error: "Erro ao carregar aulas" },
      { status: 500 }
    );
  }
}

// ─── POST /api/aulas ──────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AulaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { titulo, dataHora, duracao, moduloId, formadorId } = parsed.data;

    const aula = await prisma.aula.create({
      data: {
        titulo: titulo.trim(),
        dataHora: new Date(dataHora),
        duracao,
        moduloId,
        formadorId,
      },
      include: {
        modulo: { include: { curso: true } },
        formador: { include: { user: true } },
      },
    });

    revalidatePath("/dashboard");
    return NextResponse.json(aula, { status: 201 });
  } catch (error) {
    console.error("[POST /api/aulas]", error);
    return NextResponse.json({ error: "Erro ao criar aula" }, { status: 500 });
  }
}
