import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma"; // ✅ Adicionado Prisma
import {
  ArrowLeft,
  Mail,
  Briefcase,
  Globe,
  Github,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ─── Status badge ─────────────────────────────────────────────────────────────

function DocBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; cls: string; Icon: React.ElementType }
  > = {
    VALIDO: {
      label: "Válido",
      cls: "bg-green-50 text-green-600 border-green-200",
      Icon: CheckCircle2,
    },
    A_EXPIRAR: {
      label: "A expirar",
      cls: "bg-orange-50 text-orange-600 border-orange-200",
      Icon: Clock,
    },
    EXPIRADO: {
      label: "Expirado",
      cls: "bg-red-50 text-red-600 border-red-200",
      Icon: XCircle,
    },
    EM_FALTA: {
      label: "Em falta",
      cls: "bg-gray-50 text-gray-500 border-gray-200",
      Icon: AlertTriangle,
    },
  };

  const cfg = map[status] ?? map.EM_FALTA;
  const { label, cls, Icon } = cfg;

  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cls,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function FormadorPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COORDENADOR") redirect("/dashboard");

  // Busca direta à BD com o ID da URL
  const formadorDb = await prisma.formador.findUnique({
    where: { id: id },
    include: {
      user: true,
      documentos: true,
      modulosLecionados: {
        include: {
          modulo: {
            include: { curso: true },
          },
        },
      },
    },
  });

  if (!formadorDb) notFound();

  // Mapeamos para o layout exatamente como estava para não alterar o design
  const formador = {
    nome: formadorDb.user.nome,
    email: formadorDb.user.email,
    especialidade: formadorDb.especialidade,
    competencias: formadorDb.competencias,
    idioma: formadorDb.idioma,
    linkedin: formadorDb.linkedin,
    github: formadorDb.github,
    nacionalidade: formadorDb.nacionalidade,
    modulos: formadorDb.modulosLecionados.map((fm) => ({
      id: fm.modulo.id,
      nome: fm.modulo.nome,
      cargaHoraria: fm.modulo.cargaHoraria,
      curso: { nome: fm.modulo.curso?.nome || "Módulo Geral" },
    })),
    documentos: formadorDb.documentos,
  };

  const initials = formador.nome
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const competencias: string[] = formador.competencias
    ? formador.competencias
        .split(",")
        .map((c: string) => c.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-6 -mt-2">
      {/* Top Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/formadores"
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Lista de Formadores
        </Link>
      </div>

      {/* Header Section */}
      <div className="relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-5">
            {/* Round Avatar */}
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-indigo-50 dark:border-indigo-950 shadow-sm rounded-full shrink-0">
                <AvatarFallback className="bg-indigo-50 text-indigo-600 text-2xl font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 shadow-sm" title="Ativo" />
            </div>

            <div className="flex flex-col gap-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                  {formador.nome}
                </h1>
                <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                  Formador
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  {formador.email}
                </span>
                {formador.especialidade && (
                  <>
                    <span className="hidden md:inline text-gray-300 dark:text-gray-700">•</span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                      {formador.especialidade}
                    </span>
                  </>
                )}
                {formador.idioma && (
                  <>
                    <span className="hidden md:inline text-gray-300 dark:text-gray-700">•</span>
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-indigo-500" />
                      {formador.idioma}
                    </span>
                  </>
                )}
              </div>

              {/* Social links */}
              {(formador.linkedin || formador.github) && (
                <div className="flex items-center gap-3 mt-1 justify-center md:justify-start">
                  {formador.linkedin && (
                    <a
                      href={formador.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      LinkedIn ↗
                    </a>
                  )}
                  {formador.github && (
                    <a
                      href={formador.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" /> GitHub ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Módulos Atribuídos", value: formador.modulos.length, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
          { label: "Competências", value: competencias.length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
          { label: "Documentos", value: formador.documentos.length, icon: FileText, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 dark:text-gray-100">{stat.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Modules */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="flex items-center gap-3 text-base font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                <span className="h-7 w-1.5 rounded-full bg-indigo-600" />
                Módulos Lecionados
              </h2>
            </div>

            {formador.modulos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">Sem módulos atribuídos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formador.modulos.map((mod) => (
                  <div
                    key={mod.id}
                    className="group flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-4 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {mod.curso?.nome || "Módulo Geral"}
                      </span>
                      <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 transition-colors truncate">
                        {mod.nome}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">{mod.cargaHoraria} horas</span>
                    </div>
                    <div className="shrink-0 ml-3">
                      <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                        {mod.cargaHoraria}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Competencies, Documents, Extra Info */}
        <div className="flex flex-col gap-6">
          {/* Competencies */}
          {competencias.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h2 className="mb-6 text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                Competências
              </h2>
              <div className="flex flex-wrap gap-2">
                {competencias.map((comp: string) => (
                  <span
                    key={comp}
                    className="rounded-full border border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
              <FileText className="h-4 w-4 text-indigo-600" />
              Documentação
            </h2>

            {formador.documentos.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sem registos</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {formador.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                      {doc.tipo}
                    </span>
                    <DocBadge status={doc.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nationality */}
          {formador.nacionalidade && (
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">INFO ADICIONAL</h4>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Nacionalidade</span>
                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{formador.nacionalidade}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

