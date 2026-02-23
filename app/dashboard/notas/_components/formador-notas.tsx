"use client";

import { useState } from "react";
import { Save, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Aluno {
  id: number;
  nome: string;
  avatar: string;
  modulo: string;
  nota: number | null;
  presencas: number;
  totalSessoes: number;
}

const alunosData: Aluno[] = [
  { id: 1, nome: "Sofia Almeida",   avatar: "https://i.pravatar.cc/150?img=47", modulo: "Design Gráfico",         nota: 14, presencas: 10, totalSessoes: 12 },
  { id: 2, nome: "Carlos Mendes",   avatar: "https://i.pravatar.cc/150?img=12", modulo: "Design Gráfico",         nota: 17, presencas: 12, totalSessoes: 12 },
  { id: 3, nome: "Inês Pereira",    avatar: "https://i.pravatar.cc/150?img=49", modulo: "Design Gráfico",         nota: 9,  presencas: 8,  totalSessoes: 12 },
  { id: 4, nome: "Beatriz Lopes",   avatar: "https://i.pravatar.cc/150?img=48", modulo: "Design Gráfico",         nota: null, presencas: 6, totalSessoes: 12 },
  { id: 5, nome: "João Ferreira",   avatar: "https://i.pravatar.cc/150?img=15", modulo: "Redes de Computadores",  nota: 16, presencas: 5,  totalSessoes: 6 },
  { id: 6, nome: "Pedro Alves",     avatar: "https://i.pravatar.cc/150?img=16", modulo: "Redes de Computadores",  nota: 12, presencas: 5,  totalSessoes: 6 },
];

function getNotaColor(nota: number | null) {
  if (nota === null) return "text-gray-400";
  if (nota >= 14)    return "text-green-600";
  if (nota >= 10)    return "text-amber-600";
  return "text-red-500";
}

export default function NotasPage() {
  const [search, setSearch] = useState("");
  const [notas, setNotas] = useState<Record<number, string>>(
    Object.fromEntries(alunosData.map((a) => [a.id, a.nota !== null ? String(a.nota) : ""]))
  );
  const [saved, setSaved] = useState(false);

  const filtrados = alunosData.filter(
    (a) =>
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.modulo.toLowerCase().includes(search.toLowerCase())
  );

  const modulos = [...new Set(alunosData.map((a) => a.modulo))];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900">Notas de Alunos</h1>
          <p className="mt-0.5 text-sm text-gray-500">Registo de avaliações por módulo</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-gray-200 text-sm rounded-xl"
            />
          </div>
          <Button onClick={handleSave} className="gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-5">
            <Save className="h-4 w-4" />
            {saved ? "Guardado!" : "Guardar"}
          </Button>
        </div>
      </div>

      {/* Tables by module */}
      {modulos.map((modulo) => {
        const alunos = filtrados.filter((a) => a.modulo === modulo);
        if (alunos.length === 0) return null;
        return (
          <div key={modulo} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-bold text-gray-800">{modulo}</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-400 px-6 py-3">Aluno</th>
                  <th className="text-center text-xs font-semibold text-gray-400 px-4 py-3">Presenças</th>
                  <th className="text-center text-xs font-semibold text-gray-400 px-4 py-3">% Assiduidade</th>
                  <th className="text-center text-xs font-semibold text-gray-400 px-6 py-3">Nota Final (0–20)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alunos.map((aluno) => {
                  const assiduidade = Math.round((aluno.presencas / aluno.totalSessoes) * 100);
                  return (
                    <tr key={aluno.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <img src={aluno.avatar} alt={aluno.nome} className="h-8 w-8 rounded-full border border-gray-100 object-cover" />
                          <span className="text-sm font-medium text-gray-800">{aluno.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {aluno.presencas}/{aluno.totalSessoes}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "text-sm font-semibold",
                          assiduidade >= 75 ? "text-green-600" : "text-red-500"
                        )}>
                          {assiduidade}%
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={notas[aluno.id]}
                            onChange={(e) => setNotas((prev) => ({ ...prev, [aluno.id]: e.target.value }))}
                            placeholder="—"
                            className={cn(
                              "w-20 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-center text-sm font-bold focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400",
                              notas[aluno.id]
                                ? getNotaColor(Number(notas[aluno.id]))
                                : "text-gray-400"
                            )}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}