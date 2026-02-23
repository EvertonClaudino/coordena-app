"use client";

import { Clock, Puzzle, GraduationCap, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CursoStatus = "Ativo" | "Inativo" | "Concluído";

interface ModuloAtribuido {
  nome: string;
  codigo: string;
  tags: string[];
}

interface MeuCurso {
  id: number;
  nome: string;
  status: CursoStatus;
  cargaHoraria: number;
  formandos: number;
  dataInicio: string;
  dataFim: string;
  modulos: ModuloAtribuido[];
}

// ─── Mock Data — só os cursos onde este formador tem módulos atribuídos ───────

const meusCursos: MeuCurso[] = [
  {
    id: 1,
    nome: "Técnico de Multimédia",
    status: "Ativo",
    cargaHoraria: 1200,
    formandos: 4,
    dataInicio: "15 set 2025",
    dataFim: "30 jun 2026",
    modulos: [
      { nome: "Design Gráfico", codigo: "UFCD-0145", tags: ["Design", "Photoshop", "Illustrator"] },
    ],
  },
  {
    id: 2,
    nome: "Técnico de Informática",
    status: "Ativo",
    cargaHoraria: 1100,
    formandos: 2,
    dataInicio: "01 out 2025",
    dataFim: "15 jul 2026",
    modulos: [
      { nome: "Redes de Computadores", codigo: "UFCD-0773", tags: ["Redes", "TCP/IP", "Cisco"] },
    ],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CursoStatus, string> = {
  Ativo:     "border-green-300 text-green-700 bg-green-50",
  Inativo:   "border-gray-300  text-gray-500  bg-gray-50",
  Concluído: "border-blue-300  text-blue-700  bg-blue-50",
};

// ─── Curso Card ───────────────────────────────────────────────────────────────

function CursoCard({ curso }: { curso: MeuCurso }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-purple-200 hover:shadow-sm transition-all">
      {/* Course header */}
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-900">{curso.nome}</h2>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0" />
              {curso.cargaHoraria}h
            </span>
            <span className="flex items-center gap-1.5">
              <Puzzle className="h-4 w-4 shrink-0" />
              {curso.modulos.length} módulo{curso.modulos.length !== 1 ? "s" : ""} atribuído{curso.modulos.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 shrink-0" />
              {curso.formandos} formandos
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 shrink-0" />
              {curso.dataInicio} - {curso.dataFim}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <span className={cn(
          "shrink-0 rounded-full border px-3 py-0.5 text-xs font-semibold",
          STATUS_CONFIG[curso.status]
        )}>
          {curso.status}
        </span>
      </div>

      {/* Módulos section */}
      <div className="border-t border-gray-100 bg-purple-50/40 px-6 py-4">
        <p className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Módulos Atribuídos
        </p>

        <div className="flex flex-col gap-2">
          {curso.modulos.map((mod) => (
            <div
              key={mod.codigo}
              className="flex items-center justify-between gap-4 rounded-xl bg-white border border-gray-100 px-4 py-3 hover:border-purple-200 transition-colors"
            >
              {/* Icon + name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                  <Puzzle className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-gray-800">{mod.nome}</span>
                  <span className="text-xs text-purple-500 font-medium">{mod.codigo}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 justify-end">
                {mod.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-purple-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormadorCursos() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-gray-900">Os Meus Cursos</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          {meusCursos.length} curso{meusCursos.length !== 1 ? "s" : ""} atribuído{meusCursos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Course list */}
      <div className="flex flex-col gap-4">
        {meusCursos.map((curso) => (
          <CursoCard key={curso.id} curso={curso} />
        ))}
      </div>

      {meusCursos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Puzzle className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">Nenhum curso atribuído</p>
          <p className="text-xs text-gray-400 mt-1">O coordenador ainda não te atribuiu nenhum módulo</p>
        </div>
      )}
    </div>
  );
}