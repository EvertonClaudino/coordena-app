"use client";

import { Puzzle, GraduationCap, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

type ModuloStatus = "Ativo" | "Inativo" | "Concluído";

interface ModuloAtribuido {
  id: number;
  nome: string;
  codigo: string;
  curso: string;
  tags: string[];
  formandos: number;
  status: ModuloStatus;
}

const modulos: ModuloAtribuido[] = [
  {
    id: 1,
    nome: "Design Gráfico",
    codigo: "UFCD-0145",
    curso: "Técnico de Multimédia",
    tags: ["Design", "Photoshop", "Illustrator"],
    formandos: 4,
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Redes de Computadores",
    codigo: "UFCD-0773",
    curso: "Técnico de Informática",
    tags: ["Redes", "TCP/IP", "Cisco"],
    formandos: 2,
    status: "Ativo",
  },
];

const STATUS_STYLE: Record<ModuloStatus, string> = {
  Ativo:     "border-green-300 text-green-700 bg-green-50",
  Inativo:   "border-gray-300 text-gray-500 bg-gray-50",
  Concluído: "border-blue-300 text-blue-700 bg-blue-50",
};

function ModuloCard({ modulo }: { modulo: ModuloAtribuido }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:border-purple-200 hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100">
          <Puzzle className="h-6 w-6 text-purple-500" />
        </div>
        <span className={cn("rounded-full border px-3 py-0.5 text-xs font-semibold", STATUS_STYLE[modulo.status])}>
          {modulo.status}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-gray-900">{modulo.nome}</h3>
        <span className="text-sm text-purple-500 font-medium">{modulo.codigo}</span>
        <span className="text-sm text-gray-400">{modulo.curso}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {modulo.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 border-t border-gray-100 pt-3 text-sm text-gray-500">
        <GraduationCap className="h-4 w-4 text-gray-400" />
        {modulo.formandos} formando{modulo.formandos !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default function ModulosAtribuidosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[26px] font-bold text-gray-900">Módulos Atribuídos</h1>
        <p className="mt-0.5 text-sm text-gray-500">{modulos.length} módulos atribuídos</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modulos.map((m) => (
          <ModuloCard key={m.id} modulo={m} />
        ))}
      </div>
    </div>
  );
}