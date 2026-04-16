import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "COORDENADOR") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { formadorId, formandoId, cursoId, moduloId, descricao } =
      await req.json();

    if (!formadorId && !formandoId) {
      return NextResponse.json(
        { error: "É necessário indicar formadorId ou formandoId" },
        { status: 400 },
      );
    }

    // Se for convite para FORMADOR -> obrigar moduloId
    if (formadorId && !moduloId) {
      return NextResponse.json(
        { error: "Para convidar um formador é necessário indicar moduloId" },
        { status: 400 },
      );
    }

    // Se for convite para FORMANDO -> obrigar cursoId
    if (formandoId && !cursoId) {
      return NextResponse.json(
        { error: "Para convidar um formando é necessário indicar cursoId" },
        { status: 400 },
      );
    }

    // Se moduloId foi dado, buscar o cursoId associado e validar
    let finalCursoId = cursoId;

    if (moduloId) {
      const modulo = await prisma.modulo.findUnique({
        where: { id: moduloId },
        select: { cursoId: true },
      });

      if (!modulo) {
        return NextResponse.json(
          { error: "Módulo não encontrado" },
          { status: 404 },
        );
      }

      // Se cursoId veio junto, validar consistência
      if (cursoId && modulo.cursoId !== cursoId) {
        return NextResponse.json(
          { error: "O módulo não pertence ao curso informado" },
          { status: 400 },
        );
      }

      finalCursoId = modulo.cursoId;
    }

    // Segurança: garantir que temos cursoId final
    if (!finalCursoId) {
      return NextResponse.json(
        { error: "Não foi possível determinar o cursoId" },
        { status: 400 },
      );
    }

    // Verificar se já existe convite pendente
    const existingConvite = await prisma.convite.findFirst({
      where: {
        ...(formadorId ? { formadorId } : {}),
        ...(formandoId ? { formandoId } : {}),
        cursoId: finalCursoId,
        ...(moduloId ? { moduloId } : {}),
        status: "PENDENTE",
      },
    });

    if (existingConvite) {
      return NextResponse.json(
        { error: "Já existe um convite pendente para este convite." },
        { status: 409 },
      );
    }

    const convite = await prisma.convite.create({
      data: {
        formadorId: formadorId ?? null,
        formandoId: formandoId ?? null,
        cursoId: finalCursoId,
        moduloId: moduloId ?? null,
        descricao: descricao ?? null,
      },
    });

    return NextResponse.json(
      { message: "Convite enviado com sucesso", convite },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/convites]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
