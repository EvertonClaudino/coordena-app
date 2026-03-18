import { prisma } from "@/lib/prisma";

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getCoordenadorStats() {
  const [cursos, formadores, formandos] = await Promise.all([
    prisma.curso.count({ where: { status: "ATIVO" } }),
    prisma.formador.count(),
    prisma.formando.count(),
  ]);

  return { cursos, formadores, formandos };
}

// ─── Próximas Sessões ─────────────────────────────────────────────────────────

export async function getProximasSessoes() {
  const agora = new Date();

  const aulas = await prisma.aula.findMany({
    where: { dataHora: { gte: agora } },
    orderBy: { dataHora: "asc" },
    take: 4,
    include: {
      modulo: { include: { curso: true } },
      formador: { include: { user: true } },
    },
  });

  return aulas.map((aula) => ({
    id: aula.id,
    titulo: `${aula.modulo.curso.nome} · ${aula.titulo}`,
    formador: aula.formador.user.nome,
    dataHora: aula.dataHora,
    duracao: aula.duracao,
  }));
}

// ─── Formandos em Risco ───────────────────────────────────────────────────────

type FormandoRiscoResult = {
  id: string;
  nome: string;
  curso: string;
  negativas: number;
};

export async function getFormandosEmRisco(): Promise<FormandoRiscoResult[]> {
  // Busca todas as avaliações negativas (nota < 10) agrupadas por formando
  const avaliacoesNegativas = await prisma.avaliacao.findMany({
    where: { nota: { lt: 10 } },
    select: { formandoId: true, moduloId: true },
  });

  if (avaliacoesNegativas.length === 0) return [];

  // Conta negativas por formando
  const contagemPorFormando = avaliacoesNegativas.reduce<
    Record<string, Set<string>>
  >((acc, av) => {
    if (!acc[av.formandoId]) acc[av.formandoId] = new Set();
    acc[av.formandoId].add(av.moduloId);
    return acc;
  }, {});

  // Ordena por número de módulos com negativa (desc) e pega os top 5
  const formandoIdsOrdenados = Object.entries(contagemPorFormando)
    .sort(([, a], [, b]) => b.size - a.size)
    .slice(0, 5)
    .map(([id]) => id);

  const formandos = await prisma.formando.findMany({
    where: { id: { in: formandoIdsOrdenados } },
    include: {
      user: { select: { nome: true } },
      inscricoes: { include: { curso: { select: { nome: true } } }, take: 1 },
    },
  });

  return formandoIdsOrdenados
    .map((id) => {
      const f = formandos.find((x) => x.id === id);
      if (!f) return null;
      return {
        id: f.id,
        nome: f.user.nome,
        curso: f.inscricoes[0]?.curso.nome ?? "—",
        negativas: contagemPorFormando[id].size,
      };
    })
    .filter(Boolean) as FormandoRiscoResult[];
}

// ─── Documentos em Falta / Expirados ─────────────────────────────────────────

export type DocumentoEmFalta = {
  id: string;
  formadorId: string;
  formadorNome: string;
  tipo: string;
  status: "EM_FALTA" | "EXPIRADO" | "A_EXPIRAR";
  dataExpiracao: Date | null;
};

export async function getDocumentosEmFalta(): Promise<DocumentoEmFalta[]> {
  const docs = await prisma.documentoFormador.findMany({
    where: {
      status: { in: ["EM_FALTA", "EXPIRADO", "A_EXPIRAR"] },
    },
    include: {
      Formador: {
        include: { user: { select: { nome: true } } },
      },
    },
    orderBy: [
      // EXPIRADO primeiro, depois A_EXPIRAR, depois EM_FALTA
      { status: "asc" },
      { dataExpiracao: "asc" },
    ],
    take: 6,
  });

  return docs.map((d) => ({
    id: d.id,
    formadorId: d.formadorId,
    formadorNome: d.Formador.user.nome,
    tipo: d.tipo,
    status: d.status as "EM_FALTA" | "EXPIRADO" | "A_EXPIRAR",
    dataExpiracao: d.dataExpiracao,
  }));
}

// ─── Cursos ───────────────────────────────────────────────────────────────────

export type CursoComDetalhes = {
  id: string;
  nome: string;
  descricao: string | null;
  dataInicio: Date | null;
  dataFim: Date | null;
  cargaHoraria: number;
  status: "ATIVO" | "PAUSADO" | "ENCERRADO";
  createdAt: Date;
  modulos: Array<{
    id: string;
    nome: string;
    descricao: string | null;
    ordem: number;
    cargaHoraria: number;
  }>;
  formandos: number;
};

export async function getCursos(): Promise<CursoComDetalhes[]> {
  const cursos = await prisma.curso.findMany({
    include: { modulos: true, inscricoes: true },
    orderBy: { createdAt: "desc" },
  });

  return cursos.map((curso) => ({
    ...curso,
    formandos: curso.inscricoes.length,
  }));
}

// ─── Formadores ───────────────────────────────────────────────────────────────

export type FormadorComDetalhes = {
  id: string;
  especialidade: string | null;
  userId: string;
  modulosLecionados: Array<{ modulo: { nome: string } }>;
  user: { id: string; nome: string; email: string };
};

export async function getFormadores(): Promise<FormadorComDetalhes[]> {
  return await prisma.formador.findMany({
    include: {
      user: { select: { id: true, nome: true, email: true } },
      modulosLecionados: {
        include: { modulo: { select: { nome: true } } },
      },
    },
    orderBy: { user: { nome: "asc" } },
  });
}

// ─── Módulos ──────────────────────────────────────────────────────────────────

export type ModuloComDetalhes = {
  id: string;
  nome: string;
  descricao: string | null;
  ordem: number;
  cargaHoraria: number;
  cursoId: string;
  curso?: { id: string; nome: string };
  formadores?: Array<{
    id: string;
    especialidade: string | null;
    user: { id: string; nome: string };
  }>;
};

export async function getModulos(): Promise<ModuloComDetalhes[]> {
  const modulos = await prisma.modulo.findMany({
    include: {
      curso: { select: { id: true, nome: true } },
      formadores: {
        include: { formador: { include: { user: true } } },
      },
    },
    orderBy: { ordem: "asc" },
  });

  return modulos.map((mod) => ({
    ...mod,
    formadores: mod.formadores.map((fm) => fm.formador),
  }));
}

// ─── Formandos ────────────────────────────────────────────────────────────────

export type FormandoComDetalhes = {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
  curso: string;
  progresso: number;
  status: "ATIVO" | "INATIVO" | "CONCLUÍDO";
  negativos: number;
  favorito: boolean;
};

export async function getFormandos(): Promise<FormandoComDetalhes[]> {
  const formandos = await prisma.formando.findMany({
    include: {
      user: { select: { id: true, nome: true, email: true } },
      inscricoes: { include: { curso: true } },
      avaliacoes: true,
    },
    orderBy: { user: { nome: "asc" } },
  });

  return formandos.map((f) => {
    const negativos = f.avaliacoes.filter((a) => a.nota < 10).length;
    const progresso =
      f.avaliacoes.length > 0
        ? Math.round(
            (f.avaliacoes.reduce((sum, a) => sum + a.nota, 0) /
              f.avaliacoes.length /
              20) *
              100,
          )
        : 0;

    let status: "ATIVO" | "INATIVO" | "CONCLUÍDO" = "ATIVO";
    if (progresso === 100) status = "CONCLUÍDO";
    if (f.inscricoes.length === 0) status = "INATIVO";

    return {
      id: f.id,
      nome: f.user.nome,
      email: f.user.email,
      telefone: "",
      avatar: undefined,
      curso: f.inscricoes[0]?.curso.nome ?? "Sem curso",
      progresso,
      status,
      negativos,
      favorito: false,
    };
  });
}

// ─── Perfil do Formando ───────────────────────────────────────────────────────

export type FormandoPerfil = {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  cursos: Array<{
    id: string;
    nome: string;
    dataInicio: Date | null;
    dataFim: Date | null;
    cargaHoraria: number;
    modulos: Array<{
      id: string;
      nome: string;
      cargaHoraria: number;
      nota: number | null;
    }>;
  }>;
  avaliacoes: Array<{
    id: string;
    nota: number;
    modulo: { id: string; nome: string; curso: { id: string; nome: string } };
  }>;
};

export async function getFormandoPerfil(
  formandoId: string,
): Promise<FormandoPerfil | null> {
  const formando = await prisma.formando.findUnique({
    where: { id: formandoId },
    include: {
      user: { select: { id: true, nome: true, email: true } },
      inscricoes: {
        include: {
          curso: {
            include: {
              modulos: { select: { id: true, nome: true, cargaHoraria: true } },
            },
          },
        },
      },
      avaliacoes: {
        include: {
          modulo: { include: { curso: { select: { id: true, nome: true } } } },
        },
      },
    },
  });

  if (!formando) return null;

  return {
    id: formando.id,
    nome: formando.user.nome,
    email: formando.user.email,
    avatar: undefined,
    cursos: formando.inscricoes.map((insc) => ({
      id: insc.curso.id,
      nome: insc.curso.nome,
      dataInicio: insc.curso.dataInicio,
      dataFim: insc.curso.dataFim,
      cargaHoraria: insc.curso.cargaHoraria,
      modulos: insc.curso.modulos.map((mod) => {
        const avaliacao = formando.avaliacoes.find(
          (a) => a.moduloId === mod.id,
        );
        return {
          id: mod.id,
          nome: mod.nome,
          cargaHoraria: mod.cargaHoraria,
          nota: avaliacao?.nota ?? null,
        };
      }),
    })),
    avaliacoes: formando.avaliacoes,
  };
}

// ─── Tipos exportados ─────────────────────────────────────────────────────────
export type ProximaSessao = Awaited<
  ReturnType<typeof getProximasSessoes>
>[number];
export type FormandoEmRisco = Awaited<
  ReturnType<typeof getFormandosEmRisco>
>[number];
export type FormadorItem = FormadorComDetalhes;
