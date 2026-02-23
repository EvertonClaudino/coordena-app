"use client";

import { useState } from "react";
import { Plus, Search, Puzzle, Tag, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Modulo {
  id: number;
  nome: string;
  codigo: string;
  tags: string[];
  formador: string | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const modulosData: Modulo[] = [
  {
    id: 1,
    nome: "Design Gráfico",
    codigo: "UFCD-0145",
    tags: ["Design", "Photoshop", "Illustrator"],
    formador: "Ana Rodrigues",
  },
  {
    id: 2,
    nome: "Desenvolvimento Web",
    codigo: "UFCD-0577",
    tags: ["HTML", "CSS", "JavaScript"],
    formador: "Pedro Santos",
  },
  {
    id: 3,
    nome: "Marketing Digital",
    codigo: "UFCD-9214",
    tags: ["Marketing", "SEO", "Redes Sociais"],
    formador: "Maria Fernandes",
  },
  {
    id: 4,
    nome: "Redes de Computadores",
    codigo: "UFCD-0773",
    tags: ["Redes", "TCP/IP", "Cisco"],
    formador: "Ana Rodrigues",
  },
  {
    id: 5,
    nome: "Bases de Dados",
    codigo: "UFCD-0787",
    tags: ["SQL", "MySQL", "MongoDB"],
    formador: "Pedro Santos",
  },
  {
    id: 6,
    nome: "Contabilidade Geral",
    codigo: "UFCD-0567",
    tags: ["Contabilidade", "Finanças"],
    formador: null,
  },
];

// ─── Novo Módulo Dialog ───────────────────────────────────────────────────────

function NovoModuloDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <Plus className="h-4 w-4" />
          Novo Módulo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Módulo</DialogTitle>
          <DialogDescription>
            Preenche os dados para adicionar um novo módulo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome">Nome do módulo</Label>
            <Input id="nome" placeholder="Ex: Design Gráfico" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="codigo">Código UFCD</Label>
            <Input id="codigo" placeholder="Ex: UFCD-0145" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input id="tags" placeholder="Ex: Design, Photoshop, Illustrator" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Criar Módulo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Módulo Card ──────────────────────────────────────────────────────────────

function ModuloCard({ modulo }: { modulo: Modulo }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold text-gray-900">{modulo.nome}</h3>
          <span className="text-sm text-indigo-500 font-medium">{modulo.codigo}</span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
          <Puzzle className="h-4 w-4 text-indigo-400" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {modulo.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600"
          >
            <Tag className="h-2.5 w-2.5" />
            {tag}
          </span>
        ))}
      </div>

      {/* Formador */}
      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
        <Users className="h-4 w-4 text-gray-400 shrink-0" />
        {modulo.formador ? (
          <span className="text-sm text-gray-600">{modulo.formador}</span>
        ) : (
          <span className="text-sm font-medium text-amber-500">Sem formador</span>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ModulosPage() {
  const [search, setSearch] = useState("");

  const modulosFiltrados = modulosData.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.codigo.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900">Módulos</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {modulosData.length} módulos registados
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar módulos ou tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-gray-200 text-sm"
            />
          </div>
          <NovoModuloDialog />
        </div>
      </div>

      {/* Grid */}
      {modulosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modulosFiltrados.map((modulo) => (
            <ModuloCard key={modulo.id} modulo={modulo} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Puzzle className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">Nenhum módulo encontrado</p>
          <p className="text-xs text-gray-400 mt-1">
            Tenta ajustar a pesquisa
          </p>
        </div>
      )}
    </div>
  );
}