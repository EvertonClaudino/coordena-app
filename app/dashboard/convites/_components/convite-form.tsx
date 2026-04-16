"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { criarConvite } from "../actions";

interface Formador {
  id: string;
  user: {
    nome: string;
  };
}

interface Modulo {
  id: string;
  nome: string;
  cursoId?: string | null;
  curso?: {
    id: string;
    nome: string;
  } | null;
  formadores: {
    formador: Formador;
  }[];
}

interface Curso {
  id: string;
  nome: string;
}

interface ConviteFormProps {
  formadores: Formador[];
  modulos: Modulo[];
  cursos: Curso[];
}

export function ConviteForm({
  formadores: initialFormadores,
  modulos,
  cursos,
}: ConviteFormProps) {
  const [selectedCurso, setSelectedCurso] = useState<string>("");
  const [selectedModulo, setSelectedModulo] = useState<string>("");

  const [filteredModulos, setFilteredModulos] = useState<Modulo[]>([]);
  const [availableFormadores, setAvailableFormadores] =
    useState<Formador[]>(initialFormadores);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar módulos pelo curso selecionado
  useEffect(() => {
    if (selectedCurso) {
      const modulosDoCurso = modulos.filter(
        (m) => m.cursoId === selectedCurso || m.curso?.id === selectedCurso,
      );
      setFilteredModulos(modulosDoCurso);
    } else {
      setFilteredModulos([]);
    }

    // Sempre que mudar curso, reset módulo e formadores
    setSelectedModulo("");
    setAvailableFormadores(initialFormadores);
  }, [selectedCurso, modulos, initialFormadores]);

  // Atualizar formadores disponíveis quando o módulo muda
  useEffect(() => {
    if (selectedModulo) {
      const modulo = modulos.find((m) => m.id === selectedModulo);
      if (modulo) {
        const formadoresDoModulo = modulo.formadores.map((fm) => fm.formador);
        setAvailableFormadores(formadoresDoModulo);
      }
    } else {
      setAvailableFormadores(initialFormadores);
    }
  }, [selectedModulo, modulos, initialFormadores]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await criarConvite(formData);

      // Reset form
      setSelectedCurso("");
      setSelectedModulo("");
      setFilteredModulos([]);
      setAvailableFormadores(initialFormadores);
    } catch (error) {
      console.error("Erro ao criar convite:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4 dark:text-gray-100">
        <Plus className="h-5 w-5 text-indigo-500" /> Novo Convite
      </h2>

      <form action={handleSubmit} className="flex flex-col gap-4">
        {/* CURSO */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium dark:text-gray-300">
            Curso
          </label>
          <select
            name="cursoId"
            value={selectedCurso}
            onChange={(e) => setSelectedCurso(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
            required
          >
            <option value="">Selecione um curso...</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {/* MODULO */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium dark:text-gray-300">
            Módulo
          </label>
          <select
            name="moduloId"
            value={selectedModulo}
            onChange={(e) => setSelectedModulo(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
            required
            disabled={!selectedCurso}
          >
            <option value="">
              {selectedCurso
                ? "Selecione um módulo..."
                : "Selecione um curso primeiro"}
            </option>

            {filteredModulos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        {/* FORMADOR */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium dark:text-gray-300">
            Formador
          </label>
          <select
            name="formadorId"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
            required
            disabled={!selectedModulo}
          >
            <option value="">
              {selectedModulo
                ? "Selecione um formador..."
                : "Selecione um módulo primeiro"}
            </option>
            {availableFormadores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.user.nome}
              </option>
            ))}
          </select>
        </div>

        {/* MENSAGEM */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium dark:text-gray-300">
            Mensagem
          </label>
          <textarea
            name="descricao"
            rows={3}
            placeholder="Escreva o convite..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !selectedModulo}
          className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar Convite"}
        </button>
      </form>
    </div>
  );
}
