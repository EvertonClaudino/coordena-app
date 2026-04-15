"use client";

import { useState } from "react";
import { Plus, Search, Puzzle, Users, AlertCircle, CheckCircle, Trash2, Loader2 } from "lucide-react";
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
import { ModuloComDetalhes, CursoComDetalhes, FormadorComDetalhes } from "@/app/dashboard/_data/coordenador";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Novo Módulo Dialog ───────────────────────────────────────────────────────

function NovoModuloDialog({ cursos, formadores }: { cursos: CursoComDetalhes[]; formadores: FormadorComDetalhes[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ordem: "",
    cargaHoraria: "",
    cursoId: "",
    formadorId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!formData.nome.trim()) {
      setError("Nome do módulo é obrigatório");
      return;
    }

    if (!formData.nome.trim()) {
      setError("Nome do módulo é obrigatório");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/modulos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          descricao: formData.descricao?.trim() || null,
          ordem: parseInt(formData.ordem) || 0,
          cargaHoraria: parseInt(formData.cargaHoraria) || 0,
          cursoId: formData.cursoId,
          formadorId: formData.formadorId || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao criar módulo");
      }

      setSuccess(true);
      setFormData({ nome: "", descricao: "", ordem: "", cargaHoraria: "", cursoId: "", formadorId: "" });
      
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-xl px-5">
          <Plus className="h-4 w-4" />
          Novo Módulo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-colors">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Criar Novo Módulo</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Preenche os dados para adicionar um novo módulo.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-2 transition-colors">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 px-3 py-2 transition-colors">
            <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-300">Módulo criado com sucesso!</p>
          </div>
        )}

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-700 dark:text-gray-300">Curso *</Label>
            <select
              name="cursoId"
              value={formData.cursoId}
              onChange={handleInputChange}
              disabled={loading}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Sem curso (Módulo Geral)</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-700 dark:text-gray-300">Nome do módulo *</Label>
            <Input
              name="nome"
              placeholder="Ex: Design Gráfico"
              value={formData.nome}
              onChange={handleInputChange}
              disabled={loading}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-700 dark:text-gray-300">Descrição (opcional)</Label>
            <Input
              name="descricao"
              placeholder="Descrição do módulo"
              value={formData.descricao}
              onChange={handleInputChange}
              disabled={loading}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-700 dark:text-gray-300">Ordem</Label>
              <Input
                type="number"
                name="ordem"
                placeholder="Ex: 1"
                value={formData.ordem}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-700 dark:text-gray-300">Carga horária (horas)</Label>
              <Input
                type="number"
                name="cargaHoraria"
                placeholder="Ex: 120"
                value={formData.cargaHoraria}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-700 dark:text-gray-300">Formador (opcional)</Label>
            <select
              name="formadorId"
              value={formData.formadorId}
              onChange={handleInputChange}
              disabled={loading}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Sem formador</option>
              {formadores.map(formador => (
                <option key={formador.id} value={formador.id}>
                  {formador.user.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Cancelar
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "A criar..." : "Criar Módulo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Módulo Compact Row ───────────────────────────────────────────────────────

function ModuloCompactRow({ modulo, onEdit, onDelete }: { modulo: ModuloComDetalhes; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-sm">
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{modulo.nome}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Ordem {modulo.ordem}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Loader2 className="h-3 w-3" /> {/* Placeholder icon, could be Clock but Loader2 is available */}
            <span>{modulo.cargaHoraria} horas</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>
              {modulo.formadores && modulo.formadores.length > 0 
                ? modulo.formadores.map(f => f.user.nome).join(", ")
                : "Sem formador"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 px-3 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
        >
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Excluir Módulo Dialog ────────────────────────────────────────────────────

function ExcluirModuloDialog({ modulo, onClose, onConfirm }: { modulo: ModuloComDetalhes; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExcluir = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir módulo");
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-colors">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Excluir Módulo
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Tens a certeza que pretendes excluir o módulo <span className="font-bold text-gray-900 dark:text-gray-100">&ldquo;{modulo.nome}&rdquo;</span>?
            Esta ação não pode ser desfeita e pode falhar se existirem aulas ou avaliações associadas.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-300 transition-colors">
            {error}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-xl dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleExcluir}
            disabled={loading}
            className="rounded-xl bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                A excluir...
              </>
            ) : "Excluir Módulo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Editar Módulo Dialog ─────────────────────────────────────────────────────

function EditarModuloDialog({ modulo, cursos, formadores, onClose }: { modulo: ModuloComDetalhes; cursos: CursoComDetalhes[]; formadores: FormadorComDetalhes[]; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nome: modulo.nome,
    descricao: modulo.descricao || "",
    ordem: modulo.ordem.toString(),
    cargaHoraria: modulo.cargaHoraria.toString(),
    cursoId: modulo.cursoId || "",
    formadorId: modulo.formadores?.[0]?.id || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!formData.nome.trim()) {
      setError("Nome do módulo é obrigatório");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/modulos/${modulo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          descricao: formData.descricao?.trim() || null,
          ordem: parseInt(formData.ordem) || 0,
          cargaHoraria: parseInt(formData.cargaHoraria) || 0,
          cursoId: formData.cursoId,
          formadorId: formData.formadorId || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao atualizar módulo");
      }

      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-colors">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Editar Módulo</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">Atualiza os dados do módulo.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-2 transition-colors">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 px-3 py-2 transition-colors">
            <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-300">Módulo atualizado com sucesso!</p>
          </div>
        )}

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-700 dark:text-gray-300">Curso</Label>
            <select
              name="cursoId"
              value={formData.cursoId}
              onChange={handleInputChange}
              disabled={loading}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Sem curso (Módulo Geral)</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-700 dark:text-gray-300">Nome do módulo</Label>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              disabled={loading}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-700 dark:text-gray-300">Descrição</Label>
            <Input
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              disabled={loading}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-700 dark:text-gray-300">Ordem</Label>
              <Input
                type="number"
                name="ordem"
                value={formData.ordem}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-700 dark:text-gray-300">Carga horária</Label>
              <Input
                type="number"
                name="cargaHoraria"
                value={formData.cargaHoraria}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-700 dark:text-gray-300">Formador</Label>
            <select
              name="formadorId"
              value={formData.formadorId}
              onChange={handleInputChange}
              disabled={loading}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Sem formador</option>
              {formadores.map(formador => (
                <option key={formador.id} value={formador.id}>
                  {formador.user.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Cancelar
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "A guardar..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Modulos Content Component ─────────────────────────────────────────────────

export function ModulosContent({ modulos, cursos, formadores }: { modulos: ModuloComDetalhes[]; cursos: CursoComDetalhes[]; formadores: FormadorComDetalhes[] }) {
  const [search, setSearch] = useState("");
  const [selectedModulo, setSelectedModulo] = useState<ModuloComDetalhes | null>(null);
  const [moduloParaExcluir, setModuloParaExcluir] = useState<ModuloComDetalhes | null>(null);

  const modulosFiltrados = modulos.filter((m) => {
    const searchLower = search.toLowerCase();
    const nomeMatch = m.nome.toLowerCase().includes(searchLower);
    const cursoMatch = m.curso?.nome?.toLowerCase().includes(searchLower) ?? false;
    return nomeMatch || cursoMatch;
  });

  // Agrupar módulos por cursoId para o acordeão
  const modulosAgrupados = modulosFiltrados.reduce((acc, modulo) => {
    const key = modulo.cursoId || "outros";
    if (!acc[key]) acc[key] = [];
    acc[key].push(modulo);
    return acc;
  }, {} as Record<string, ModuloComDetalhes[]>);

  // Identificar os IDs dos cursos que possuem módulos (ou que estão na lista de cursos)
  const cursoIdsComModulos = Object.keys(modulosAgrupados).filter(id => id !== "outros");
  const modulosSemCurso = modulosAgrupados["outros"] || [];

  const handleConfirmExcluir = async () => {
    if (!moduloParaExcluir) return;

    const response = await fetch(`/api/modulos/${moduloParaExcluir.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Erro ao excluir módulo");
    }

    // Recarregar a página para atualizar os dados (ou poderia atualizar o estado local se preferir)
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900 dark:text-gray-100">Módulos</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {modulos.length} módulos registados
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar módulos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm rounded-xl dark:text-gray-200"
            />
          </div>
          <NovoModuloDialog cursos={cursos} formadores={formadores} />
        </div>
      </div>

      {/* Accordion List - Grouped by Course */}
      <div className="flex flex-col gap-4">
        {modulosFiltrados.length > 0 ? (
          <Accordion type="multiple" className="w-full space-y-4">
            {/* Cursos com Módulos */}
            {cursos
              .filter(curso => modulosAgrupados[curso.id])
              .map((curso) => (
                <AccordionItem 
                  key={curso.id} 
                  value={curso.id}
                  className="border rounded-2xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 overflow-hidden transition-all hover:border-indigo-200"
                >
                  <AccordionTrigger className="hover:no-underline py-5 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
                        <Puzzle className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-bold text-lg">{curso.nome}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {modulosAgrupados[curso.id].length} módulos
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="flex flex-col gap-3 pt-2">
                      {modulosAgrupados[curso.id].map(modulo => (
                        <ModuloCompactRow 
                          key={modulo.id} 
                          modulo={modulo} 
                          onEdit={() => setSelectedModulo(modulo)} 
                          onDelete={() => setModuloParaExcluir(modulo)}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

            {/* Módulos Sem Curso (Outros) */}
            {modulosSemCurso.length > 0 && (
              <AccordionItem 
                value="outros"
                className="border rounded-2xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 overflow-hidden transition-all hover:border-amber-200"
              >
                <AccordionTrigger className="hover:no-underline py-5 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/30">
                      <Puzzle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-bold text-lg">Outros (Sem curso associado)</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {modulosSemCurso.length} módulos
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="flex flex-col gap-3 pt-2">
                    {modulosSemCurso.map(modulo => (
                      <ModuloCompactRow 
                        key={modulo.id} 
                        modulo={modulo} 
                        onEdit={() => setSelectedModulo(modulo)} 
                        onDelete={() => setModuloParaExcluir(modulo)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-16 text-center">
            <Puzzle className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">Nenhum módulo encontrado</p>
          </div>
        )}
      </div>

      {selectedModulo && (
        <EditarModuloDialog modulo={selectedModulo} cursos={cursos} formadores={formadores} onClose={() => setSelectedModulo(null)} />
      )}

      {moduloParaExcluir && (
        <ExcluirModuloDialog 
          modulo={moduloParaExcluir} 
          onClose={() => setModuloParaExcluir(null)} 
          onConfirm={handleConfirmExcluir} 
        />
      )}
    </div>
  );
}
