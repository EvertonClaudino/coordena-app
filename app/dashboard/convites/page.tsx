"use client";

import { useState } from "react";
import { Mail, CheckCircle2, XCircle, Clock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ConviteStatus = "pendente" | "aceite" | "recusado";

interface Convite {
  id: number;
  modulo: string;
  codigo: string;
  curso: string;
  coordenador: string;
  dataEnvio: string;
  status: ConviteStatus;
}

const convitesData: Convite[] = [
  {
    id: 1,
    modulo: "Gestão de Projetos",
    codigo: "UFCD-1102",
    curso: "Gestão de Empresas",
    coordenador: "Carlos Mendes",
    dataEnvio: "20 Fev 2026",
    status: "pendente",
  },
  {
    id: 2,
    modulo: "Design Gráfico",
    codigo: "UFCD-0145",
    curso: "Técnico de Multimédia",
    coordenador: "Carlos Mendes",
    dataEnvio: "10 Jan 2026",
    status: "aceite",
  },
  {
    id: 3,
    modulo: "Redes de Computadores",
    codigo: "UFCD-0773",
    curso: "Técnico de Informática",
    coordenador: "Carlos Mendes",
    dataEnvio: "10 Jan 2026",
    status: "aceite",
  },
];

const STATUS_CONFIG: Record<ConviteStatus, { label: string; icon: React.ElementType; className: string }> = {
  pendente:  { label: "Pendente",  icon: Clock,         className: "bg-amber-100 text-amber-700" },
  aceite:    { label: "Aceite",    icon: CheckCircle2,  className: "bg-green-100 text-green-700" },
  recusado:  { label: "Recusado",  icon: XCircle,       className: "bg-red-100 text-red-600" },
};

export default function ConvitesPage() {
  const [convites, setConvites] = useState<Convite[]>(convitesData);

  function responder(id: number, resposta: "aceite" | "recusado") {
    setConvites((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: resposta } : c))
    );
  }

  const pendentes  = convites.filter((c) => c.status === "pendente");
  const historico  = convites.filter((c) => c.status !== "pendente");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[26px] font-bold text-gray-900">Convites</h1>
        <p className="mt-0.5 text-sm text-gray-500">Convites para módulos enviados pelo coordenador</p>
      </div>

      {/* Pending */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">
          Pendentes{" "}
          {pendentes.length > 0 && (
            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
              {pendentes.length}
            </span>
          )}
        </h2>

        {pendentes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
            <Mail className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">Sem convites pendentes</p>
          </div>
        ) : (
          pendentes.map((convite) => (
            <div key={convite.id} className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <Mail className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <span className="text-sm font-bold text-gray-900">{convite.modulo}</span>
                <span className="text-xs text-purple-600 font-medium">{convite.codigo}</span>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{convite.curso}</span>
                  <span>De: {convite.coordenador}</span>
                  <span>{convite.dataEnvio}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => responder(convite.id, "recusado")}
                  variant="outline"
                  className="rounded-xl border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500 text-xs px-3"
                >
                  Recusar
                </Button>
                <Button
                  size="sm"
                  onClick={() => responder(convite.id, "aceite")}
                  className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs px-3"
                >
                  Aceitar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* History */}
      {historico.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Histórico</h2>
          {historico.map((convite) => {
            const cfg = STATUS_CONFIG[convite.status];
            const Icon = cfg.icon;
            return (
              <div key={convite.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-gray-800">{convite.modulo}</span>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>{convite.codigo}</span>
                    <span>·</span>
                    <span>{convite.curso}</span>
                    <span>·</span>
                    <span>{convite.dataEnvio}</span>
                  </div>
                </div>
                <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0", cfg.className)}>
                  <Icon className="h-3.5 w-3.5" />
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}