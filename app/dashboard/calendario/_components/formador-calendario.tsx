"use client";

import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Clock, Users, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Sessao {
  id: number;
  titulo: string;
  formador: string;
  data: string; // "YYYY-MM-DD"
  horaInicio: string;
  duracao: string;
  ufcd: string;
  cor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const sessoes: Sessao[] = [
  { id: 1,  titulo: "Design Gráfico - Sessão 12",          formador: "Ana Rodrigues",   data: "2026-02-23", horaInicio: "09:00", duracao: "3h",  ufcd: "UFCD-0145", cor: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { id: 2,  titulo: "Desenvolvimento Web - Sessão 8",       formador: "Pedro Santos",    data: "2026-02-23", horaInicio: "14:00", duracao: "2h",  ufcd: "UFCD-0577", cor: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: 3,  titulo: "Marketing Digital - Sessão 5",         formador: "Maria Fernandes", data: "2026-02-24", horaInicio: "09:00", duracao: "4h",  ufcd: "UFCD-9214", cor: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: 4,  titulo: "Redes de Computadores - Sessão 10",    formador: "Ana Rodrigues",   data: "2026-02-25", horaInicio: "14:00", duracao: "3h",  ufcd: "UFCD-0773", cor: "bg-green-100 text-green-700 border-green-200" },
  { id: 5,  titulo: "Design Gráfico - Sessão 13",           formador: "Ana Rodrigues",   data: "2026-02-26", horaInicio: "09:00", duracao: "3h",  ufcd: "UFCD-0145", cor: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { id: 6,  titulo: "Desenvolvimento Web - Sessão 9",       formador: "Pedro Santos",    data: "2026-03-02", horaInicio: "14:00", duracao: "2h",  ufcd: "UFCD-0577", cor: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: 7,  titulo: "Marketing Digital - Sessão 6",         formador: "Maria Fernandes", data: "2026-03-03", horaInicio: "09:00", duracao: "4h",  ufcd: "UFCD-9214", cor: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: 8,  titulo: "Bases de Dados - Sessão 4",            formador: "Pedro Santos",    data: "2026-03-05", horaInicio: "10:00", duracao: "3h",  ufcd: "UFCD-0787", cor: "bg-amber-100 text-amber-700 border-amber-200" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ─── Nova Sessão Dialog ───────────────────────────────────────────────────────

function NovaSessaoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <Plus className="h-4 w-4" /> Nova Sessão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Sessão</DialogTitle>
          <DialogDescription>Preenche os dados da sessão de formação.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Título</Label>
            <Input placeholder="Ex: Design Gráfico - Sessão 14" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Código UFCD</Label>
            <Input placeholder="Ex: UFCD-0145" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Data</Label>
              <Input type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Hora de início</Label>
              <Input type="time" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Duração (horas)</Label>
            <Input type="number" placeholder="Ex: 3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Criar Sessão</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormadorCalendarioPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toISO(today.getFullYear(), today.getMonth(), today.getDate()));

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const sessoesDoMes = sessoes.filter((s) => s.data.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`));
  const sessoesDoDia = sessoes.filter((s) => s.data === selectedDate);

  // Days that have sessions this month
  const diasComSessoes = new Set(sessoesDoMes.map((s) => parseInt(s.data.split("-")[2])));

  const selectedDateLabel = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" })
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900">Calendário</h1>
          <p className="mt-0.5 text-sm text-gray-500">{sessoesDoMes.length} sessões este mês</p>
        </div>
        <NovaSessaoDialog />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        {/* Calendar grid */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <h2 className="text-base font-bold text-gray-900">
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_SHORT.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const iso = toISO(viewYear, viewMonth, day);
              const isToday = iso === todayISO;
              const isSelected = iso === selectedDate;
              const hasSessao = diasComSessoes.has(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(iso)}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-xl py-2 text-sm font-medium transition-all",
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : isToday
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {day}
                  {hasSessao && (
                    <span className={cn(
                      "mt-0.5 h-1 w-1 rounded-full",
                      isSelected ? "bg-white/60" : "bg-indigo-400"
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Session list for selected day */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-1 capitalize">
              {selectedDateLabel ?? "Seleciona um dia"}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {sessoesDoDia.length > 0 ? `${sessoesDoDia.length} sessão(ões)` : "Sem sessões"}
            </p>

            {sessoesDoDia.length > 0 ? (
              <div className="flex flex-col gap-3">
                {sessoesDoDia.map((sessao) => (
                  <div key={sessao.id} className={cn("rounded-xl border p-4 flex flex-col gap-2", sessao.cor)}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight">{sessao.titulo}</p>
                      <span className="shrink-0 rounded-lg bg-white/60 border border-current/10 px-2 py-0.5 text-[11px] font-medium">
                        {sessao.ufcd}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs opacity-80">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {sessao.horaInicio} · {sessao.duracao}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {sessao.formador}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-8 w-8 text-gray-200 mb-2" />
                <p className="text-xs text-gray-400">Nenhuma sessão neste dia</p>
              </div>
            )}
          </div>

          {/* Próximas sessões (all upcoming) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Próximas Sessões</h3>
            <div className="flex flex-col gap-3">
              {sessoes
                .filter((s) => s.data >= todayISO)
                .sort((a, b) => a.data.localeCompare(b.data))
                .slice(0, 4)
                .map((sessao) => {
                  const [, month, day] = sessao.data.split("-");
                  return (
                    <button
                      key={sessao.id}
                      onClick={() => setSelectedDate(sessao.data)}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-left hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                    >
                      <div className="flex w-10 shrink-0 flex-col items-center rounded-lg bg-indigo-100 py-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">
                          {MONTHS[parseInt(month) - 1].slice(0, 3)}
                        </span>
                        <span className="text-sm font-bold leading-tight text-indigo-700">{day}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-semibold text-gray-800 truncate">{sessao.titulo}</span>
                        <span className="text-[11px] text-gray-400">{sessao.horaInicio} · {sessao.duracao} · {sessao.formador}</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}