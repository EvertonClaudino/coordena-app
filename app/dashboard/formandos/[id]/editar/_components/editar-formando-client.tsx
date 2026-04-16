"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  formando: {
    id: string;
    userId: string;
    nome: string;
    email: string;
    cursoId: string;
    cursoNome: string;
  };
  cursos: { id: string; nome: string }[];
}

export function EditarFormandoClient({ formando, cursos }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: formando.nome,
    email: formando.email,
    cursoId: formando.cursoId,
    novaSenha: "",
  });

  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setErro("");
    setSucesso(false);

    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setErro("");
    setSucesso(false);

    if (!form.nome.trim() || !form.email.trim()) {
      setErro("Nome e email são obrigatórios.");
      return;
    }

    if (form.novaSenha && form.novaSenha.length < 6) {
      setErro("A password deve ter no mínimo 6 caracteres.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/formandos/${formando.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formando.userId,
          nome: form.nome.trim(),
          email: form.email.trim(),
          cursoId: form.cursoId || null,
          novaSenha: form.novaSenha || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.error ?? "Erro ao guardar alterações.");
        return;
      }

      setSucesso(true);

      setTimeout(() => {
        router.push(`/dashboard/formandos/${formando.id}`);
        router.refresh();
      }, 800);
    } catch (err) {
      console.error(err);
      setErro("Erro de rede. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col gap-4">
        <Link
          href={`/dashboard/formandos/${formando.id}`}
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Perfil
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
            Editar Perfil
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Gerencie as informações básicas e credenciais de {formando.nome}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Personal Information */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
            <h2 className="mb-8 flex items-center gap-3 text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
              <span className="h-8 w-1.5 rounded-full bg-indigo-600" />
              Informações Pessoais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                  Nome Completo
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Ex: João Silva"
                  className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                  Endereço de Email
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Ex: joao@email.com"
                    className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security / Password */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
              <span className="h-8 w-1.5 rounded-full bg-indigo-600" />
              Segurança e Acesso
            </h2>

            <div className="flex flex-col gap-2 max-w-md">
              <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                Nova Password
                <span className="text-[10px] text-gray-400 font-bold lowercase">(opcional)</span>
              </Label>
              <Input
                name="novaSenha"
                type="password"
                value={form.novaSenha}
                onChange={handleChange}
                disabled={saving}
                placeholder="Introduza apenas se desejar alterar"
                className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl h-11"
              />
              <p className="mt-1 text-[11px] text-gray-400 font-medium">
                Caso deseje manter a senha atual, deixe este campo em branco.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar: Academic & Actions */}
        <div className="flex flex-col gap-6">
          {/* Academic Selection */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
              Configurações
            </h2>

            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                Curso Atribuído
              </Label>
              <select
                name="cursoId"
                value={form.cursoId}
                onChange={handleChange}
                disabled={saving}
                className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">Nenhum Curso Selecionado</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-gray-400 font-medium">
                O aluno terá acesso aos módulos vinculados a este curso.
              </p>
            </div>
          </div>

          {/* Actions Card */}
          <div className="rounded-3xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 p-8 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Feedback messages inside actions card for better visibility */}
              {erro && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-4 text-xs font-bold text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                  {erro}
                </div>
              )}

              {sucesso && (
                <div className="rounded-xl bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 p-4 text-xs font-bold text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-top-2">
                  Alterações guardadas com sucesso!
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="h-12 w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar Alterações
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
                className="h-12 w-full font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
