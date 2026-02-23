"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  GraduationCap,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data (substitui por chamadas à API) ─────────────────────────────────────

const kpis = [
  {
    label: "CURSOS ATIVOS",
    value: 2,
    icon: BookOpen,
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    label: "FORMADORES",
    value: 3,
    icon: Users,
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    label: "FORMANDOS",
    value: 6,
    icon: GraduationCap,
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    label: "ALERTAS",
    value: 7,
    icon: AlertTriangle,
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

const proximasSessoes = [
  {
    id: 1,
    diaMes: { dia: "23", mes: "FEV" },
    titulo: "Design Gráfico - Sessão 12",
    formador: "Ana Rodrigues",
    horario: "09:00 · 3h",
    ufcd: "UFCD-0145",
  },
  {
    id: 2,
    diaMes: { dia: "23", mes: "FEV" },
    titulo: "Desenvolvimento Web - Sessão 8",
    formador: "Pedro Santos",
    horario: "14:00 · 2h",
    ufcd: "UFCD-0577",
  },
  {
    id: 3,
    diaMes: { dia: "24", mes: "FEV" },
    titulo: "Marketing Digital - Sessão 5",
    formador: "Maria Fernandes",
    horario: "09:00 · 4h",
    ufcd: "UFCD-9214",
  },
  {
    id: 4,
    diaMes: { dia: "25", mes: "FEV" },
    titulo: "Redes de Computadores - Sessão 10",
    formador: "Ana Rodrigues",
    horario: "14:00 · 3h",
    ufcd: "UFCD-0773",
  },
];

const alunosEmRisco = [
  { id: 1, nome: "Sofia Almeida",  curso: "Técnico de Multimédia",   negs: 1 },
  { id: 2, nome: "Beatriz Lopes",  curso: "Técnico de Informática",  negs: 1 },
  { id: 3, nome: "Inês Pereira",   curso: "Técnico de Multimédia",   negs: 2 },
];

const documentosExpirar = [
  { id: 1, nome: "Seguro de Acidentes Pessoais", expira: "28 Fev 2026", urgente: true },
  { id: 2, nome: "Contrato Formação — Turma A",  expira: "05 Mar 2026", urgente: false },
  { id: 3, nome: "Certificação do Formador",     expira: "12 Mar 2026", urgente: false },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function CoordenadorDashboard({ userName }: { userName: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 19 ? "Boa tarde" : "Boa noite";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-gray-900">
          {greeting}, {userName.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">Aqui está o resumo da sua formação</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={cn(
                "flex items-center justify-between rounded-2xl p-5",
                kpi.bg
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold tracking-widest text-gray-500">
                  {kpi.label}
                </span>
                <span className="text-4xl font-bold text-gray-900">{kpi.value}</span>
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  kpi.iconBg
                )}
              >
                <Icon className={cn("h-6 w-6", kpi.iconColor)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        {/* Próximas Sessões */}
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Clock className="h-4 w-4 text-indigo-500" />
              Próximas Sessões
            </h2>
            <Link
              href="/dashboard/calendario"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Ver calendário <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {proximasSessoes.map((sessao) => (
              <div
                key={sessao.id}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
              >
                {/* Date badge */}
                <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-indigo-100 py-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                    {sessao.diaMes.mes}
                  </span>
                  <span className="text-lg font-bold leading-tight text-indigo-700">
                    {sessao.diaMes.dia}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {sessao.titulo}
                  </span>
                  <span className="text-xs text-gray-500">
                    {sessao.formador} · {sessao.horario}
                  </span>
                </div>

                {/* UFCD */}
                <span className="shrink-0 rounded-lg bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
                  {sessao.ufcd}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Alunos em Risco */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Alunos em Risco
            </h2>
            <div className="flex flex-col gap-3">
              {alunosEmRisco.map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {aluno.nome}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {aluno.curso}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-lg px-3 py-1 text-xs font-bold",
                      aluno.negs >= 2
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    )}
                  >
                    {aluno.negs} neg.
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documentos a Expirar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <FileWarning className="h-4 w-4 text-amber-500" />
              Documentos a Expirar
            </h2>
            <div className="flex flex-col gap-3">
              {documentosExpirar.map((doc) => (
                <div key={doc.id} className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {doc.nome}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        doc.urgente ? "text-red-500" : "text-gray-400"
                      )}
                    >
                      Expira: {doc.expira}
                    </span>
                  </div>
                  {doc.urgente && (
                    <span className="shrink-0 rounded-lg bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                      URGENTE
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}