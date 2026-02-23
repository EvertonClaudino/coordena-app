"use client";

import { BookOpen, Clock, ClipboardList, AlertTriangle, CalendarDays, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// ─── KPIs ─────────────────────────────────────────────────────────────────────

const kpis = [
  { label: "CURSOS INSCRITOS",   value: 1,    icon: BookOpen,      bg: "bg-teal-50",   iconBg: "bg-teal-100",   iconColor: "text-teal-500"   },
  { label: "MÓDULOS COMPLETOS",  value: "3/5",    icon: Clock,         bg: "bg-blue-50",   iconBg: "bg-blue-100",   iconColor: "text-blue-500"   },
  { label: "PRÓXIMAS SESSÕES",   value: "14", icon: ClipboardList, bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const proximasSessoes = [
  { id: 1, dia: "25", mes: "FEV", titulo: "Design Gráfico - Sessão 12",        horario: "09:00 · 3h", formador: "Ana Rodrigues"   },
  { id: 2, dia: "25", mes: "FEV", titulo: "Redes de Computadores - Sessão 10", horario: "14:00 · 3h", formador: "Ana Rodrigues"   },
];

const meusModulos = [
  { id: 1, nome: "Design Gráfico",         codigo: "UFCD-0145", nota: 14, progresso: 72,  status: "positivo"  },
  { id: 2, nome: "Desenvolvimento Web",    codigo: "UFCD-0577", nota: 9,  progresso: 58,  status: "negativo"  },
  { id: 3, nome: "Redes de Computadores",  codigo: "UFCD-0773", nota: null, progresso: 40, status: "sem nota"  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function FormandoDashboard({ userName }: { userName: string }) {
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Bom dia" : hour < 19 ? "Olá" : "Boa noite";
  const firstName = userName.split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 className="text-[26px] font-bold text-gray-900">{greeting}, {firstName} 👋</h1>
        <p className="mt-1 text-sm text-gray-400">O teu painel de aprendizagem</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={cn("flex items-center justify-between rounded-2xl p-5", kpi.bg)}>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold tracking-widest text-gray-500">{kpi.label}</span>
                <span className="text-4xl font-bold text-gray-900">{kpi.value}</span>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", kpi.iconBg)}>
                <Icon className={cn("h-6 w-6", kpi.iconColor)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Curso em progresso */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <GraduationCap className="h-4 w-4 text-teal-400" />
            O Meu Curso
          </h2>
          <span className="rounded-full border border-green-300 bg-green-50 px-3 py-0.5 text-xs font-semibold text-green-700">
            Ativo
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Técnico de Multimédia</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 1200h</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> 3 módulos</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> 15 set 2025 – 30 jun 2026</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-bold text-teal-600">57%</span>
              <p className="text-xs text-gray-400 mt-0.5">progresso geral</p>
            </div>
          </div>

          <Progress value={57} className="h-2 bg-gray-100 [&>*]:bg-teal-400" />

          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { label: "Design Gráfico",        pct: 72, nota: 14 },
              { label: "Desenvolvimento Web",   pct: 58, nota: 9  },
              { label: "Redes de Computadores", pct: 40, nota: null },
            ].map((m) => (
              <div key={m.label} className="flex flex-col gap-1.5 rounded-xl bg-gray-50 border border-gray-100 p-3">
                <span className="text-xs font-semibold text-gray-700 leading-tight">{m.label}</span>
                <Progress
                  value={m.pct}
                  className={cn(
                    "h-1.5 bg-gray-200",
                    m.nota !== null && m.nota < 10 ? "[&>*]:bg-red-400" : "[&>*]:bg-teal-400"
                  )}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{m.pct}%</span>
                  <span className={cn(
                    "text-[11px] font-bold",
                    m.nota === null ? "text-gray-400" : m.nota >= 10 ? "text-green-600" : "text-red-500"
                  )}>
                    {m.nota !== null ? `${m.nota}/20` : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Próximas Sessões */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Clock className="h-4 w-4 text-teal-400" />
              Próximas Sessões
            </h2>
            <Link href="/dashboard/calendario-formando" className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {proximasSessoes.map((s) => (
              <div key={s.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-teal-100 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-500">{s.mes}</span>
                  <span className="text-lg font-bold leading-tight text-teal-700">{s.dia}</span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-gray-800 truncate">{s.titulo}</span>
                  <span className="text-xs text-gray-400">{s.horario} · {s.formador}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Os Meus Módulos */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <ClipboardList className="h-4 w-4 text-purple-400" />
              Os Meus Módulos
            </h2>
            <Link href="/dashboard/minhas-notas" className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
              Ver notas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {meusModulos.map((mod) => {
              const notaColor =
                mod.nota === null   ? "text-gray-400" :
                mod.nota >= 10      ? "text-green-600" :
                                      "text-red-500";
              return (
                <div key={mod.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-semibold text-gray-800 truncate">{mod.nome}</span>
                      <span className="text-xs text-gray-400">{mod.codigo}</span>
                    </div>
                    <span className={cn("text-lg font-bold shrink-0", notaColor)}>
                      {mod.nota !== null ? `${mod.nota}/20` : "—"}
                    </span>
                  </div>
                  <Progress
                    value={mod.progresso}
                    className={cn(
                      "h-1.5 bg-gray-100",
                      mod.status === "negativo"
                        ? "[&>*]:bg-red-400"
                        : "[&>*]:bg-teal-400"
                    )}
                  />
                  <span className="text-[11px] text-gray-400">{mod.progresso}% concluído</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}