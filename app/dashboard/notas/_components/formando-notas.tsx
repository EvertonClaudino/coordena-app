"use client";

import React from "react";
import { TrendingUp, Award, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion"; // Corrigido de motion/react para framer-motion (padrão)

interface Nota {
  id: number;
  modulo: string;
  codigo: string;
  nota: number;
  presencas: number;
  totalSessoes: number;
}

// Dados fictícios simulando o que viria de uma API para o aluno logado
const minhasNotas: Nota[] = [
  { id: 1, modulo: "Design Gráfico", codigo: "DG-2026", nota: 14, presencas: 10, totalSessoes: 12 },
  { id: 2, modulo: "Marketing Digital", codigo: "MD-2026", nota: 17, presencas: 12, totalSessoes: 12 },
  { id: 3, modulo: "Desenvolvimento Web", codigo: "DW-2026", nota: 18, presencas: 11, totalSessoes: 12 },
];

export default function FormandoNotas() {
  // Cálculo da Média Geral
  const avg = minhasNotas.length > 0
    ? (minhasNotas.reduce((sum, item) => sum + item.nota, 0) / minhasNotas.length).toFixed(1)
    : "0";

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">As Minhas Notas</h1>
            <p className="text-sm text-slate-500 mt-1">Consulte o seu desempenho acadêmico</p>
          </div>

          {/* Card de Média Geral */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200/50"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 text-cyan-50">Média Geral do Curso</p>
                <p className="text-4xl font-bold">
                  {avg}<span className="text-lg font-normal opacity-60">/20</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabela de Notas */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Módulo</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Nota</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Assiduidade</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {minhasNotas.map((item, i) => {
                    const isPassed = item.nota >= 10;
                    const freq = ((item.presencas / item.totalSessoes) * 100).toFixed(0);

                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-700">{item.modulo}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                            {item.codigo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className={`text-lg font-bold ${isPassed ? "text-emerald-600" : "text-red-500"}`}>
                              {item.nota}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase">Valores</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-slate-600">
                          {item.presencas}/{item.totalSessoes} 
                          <span className="text-xs text-slate-400 ml-1">({freq}%)</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isPassed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                          }`}>
                            {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {isPassed ? "Aprovado" : "Reprovado"}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}