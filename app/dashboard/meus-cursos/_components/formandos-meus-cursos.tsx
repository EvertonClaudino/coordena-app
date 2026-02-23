"use client";

import { Clock, BookOpen, CalendarDays, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// ─── Types ────────────────────────────────────────────────────────────────────

type CursoStatus = "Ativo" | "Concluído" | "Inativo";

interface Modulo {
  nome: string;
  codigo: string;
  formador: string;
  nota: number | null;
  progresso: number;
}

interface MeuCurso {
  id: number;
  nome: string;
  status: CursoStatus;
  cargaHoraria: number;
  dataInicio: string;
  dataFim: string;
  progressoGeral: number;
  modulos: Modulo[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const meusCursos: MeuCurso[] = [
  {
    id: 1,
    nome: "Técnico de Multimédia",
    status: "Ativo",
    cargaHoraria: 1200,
    dataInicio: "15 set 2025",
    dataFim: "30 jun 2026",
    progressoGeral: 57,
    modulos: [
      { nome: "Design Gráfico",        codigo: "UFCD-0145", formador: "Ana Rodrigues",  nota: 14,   progresso: 72 },
      { nome: "Desenvolvimento Web",   codigo: "UFCD-0577", formador: "Pedro Santos",   nota: 9,    progresso: 58 },
      { nome: "Redes de Computadores", codigo: "UFCD-0773", formador: "Ana Rodrigues",  nota: null, progresso: 40 },
    ],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CursoStatus, string> = {
  Ativo:     "border-green-300 text-green-700 bg-green-50",
  Concluído: "border-blue-300  text-blue-700  bg-blue-50",
  Inativo:   "border-gray-300  text-gray-500  bg-gray-50",
};

function getNotaColor(nota: number | null) {
  if (nota === null) return "text-gray-400";
  if (nota >= 10)    return "text-green-600";
  return "text-red-500";
}

// ─── Curso Card ───────────────────────────────────────────────────────────────

function CursoCard({ curso }: { curso: MeuCurso }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-bold text-gray-900">{curso.nome}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{curso.cargaHoraria}h</span>
              <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{curso.modulos.length} módulos</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{curso.dataInicio} – {curso.dataFim}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={cn("rounded-full border px-3 py-0.5 text-xs font-semibold", STATUS_CONFIG[curso.status])}>
              {curso.status}
            </span>
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Overall progress */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Progresso geral</span>
            <span className="font-bold text-teal-600">{curso.progressoGeral}%</span>
          </div>
          <Progress value={curso.progressoGeral} className="h-2 bg-gray-100 [&>*]:bg-teal-400" />
        </div>
      </div>

      {/* Modules */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <p className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Módulos</p>
          <div className="flex flex-col gap-3">
            {curso.modulos.map(mod => {
              const assiduidade = Math.round((mod.progresso / 100) * 100);
              return (
                <div key={mod.codigo} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
                  {/* Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100">
                    <BookOpen className="h-4 w-4 text-teal-500" />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-800 truncate">{mod.nome}</span>
                      <span className={cn("text-sm font-bold shrink-0", getNotaColor(mod.nota))}>
                        {mod.nota !== null ? `${mod.nota}/20` : "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{mod.codigo}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{mod.formador}</span>
                    </div>
                    <Progress
                      value={mod.progresso}
                      className={cn(
                        "h-1.5 bg-gray-100",
                        mod.nota !== null && mod.nota < 10 ? "[&>*]:bg-red-400" : "[&>*]:bg-teal-400"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormandoCursos() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[26px] font-bold text-gray-900">Os Meus Cursos</h1>
        <p className="mt-0.5 text-sm text-gray-500">{meusCursos.length} curso{meusCursos.length !== 1 ? "s" : ""} inscrito{meusCursos.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex flex-col gap-4">
        {meusCursos.map(curso => <CursoCard key={curso.id} curso={curso} />)}
      </div>
    </div>
  );
}