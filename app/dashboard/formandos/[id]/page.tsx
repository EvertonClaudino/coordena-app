import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  BookOpen,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFormandoPerfil } from "@/app/dashboard/_data/coordenador";
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

export default async function FormandoPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COORDENADOR") redirect("/dashboard");

  const perfil = await getFormandoPerfil(id);
  if (!perfil) notFound();

  const initials = perfil.nome
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const mediaNota =
    perfil.avaliacoes.length > 0
      ? (
          perfil.avaliacoes.reduce((sum, a) => sum + a.nota, 0) /
          perfil.avaliacoes.length
        ).toFixed(1)
      : "—";

  const positivas = perfil.avaliacoes.filter((a) => a.nota >= 10).length;
  const negativas = perfil.avaliacoes.filter((a) => a.nota < 10).length;

  return (
    <div className="flex flex-col gap-6 -mt-2">
      {/* Top Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/formandos"
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Lista de Formandos
        </Link>
      </div>

      {/* Header Section (Clean Business Style) */}
      <div className="relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
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
                  {perfil.nome}
                </h1>
                <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                  Formando
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  {perfil.email}
                </span>
                <span className="hidden md:inline text-gray-300 dark:text-gray-700">•</span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                  {perfil.cursos[0]?.nome || "Sem curso ativo"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/formandos/${id}/editar`}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              Editar Perfil
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Média Geral", value: mediaNota, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
          { label: "Modulos Positivos", value: positivas, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
          { label: "Modulos Negativos", value: negativas, icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30" },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
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
        {/* Left Column: Courses & Modules */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="flex items-center gap-3 text-base font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                <span className="h-7 w-1.5 rounded-full bg-indigo-600" />
                Cursos e Desempenho
              </h2>
            </div>

            {perfil.cursos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">Não está inscrito em nenhum curso</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {perfil.cursos.map((curso) => (
                  <div key={curso.id} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1 border-l-4 border-indigo-500 pl-4 py-1">
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-100 leading-none">
                        {curso.nome}
                      </h3>
                      <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 tracking-wide uppercase">
                        Carga Horária: {curso.cargaHoraria}h
                        {curso.dataInicio && (
                          <> • Início: {new Date(curso.dataInicio).toLocaleDateString("pt-PT")}</>
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {curso.modulos.map((mod) => (
                        <div
                          key={mod.id}
                          className="group flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-4 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">UFCD-{mod.id.slice(0, 4)}</span>
                            <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 transition-colors">
                              {mod.nome}
                            </span>
                            <span className="text-[10px] font-medium text-gray-400">{mod.cargaHoraria} horas aplicadas</span>
                          </div>

                          <div className="flex flex-col items-center">
                            {mod.nota !== null ? (
                              <div
                                className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black shadow-sm",
                                  mod.nota >= 10
                                    ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                    : "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900",
                                )}
                              >
                                {Math.round(mod.nota)}
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border border-transparent">
                                <Clock className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info & Documents */}
        <div className="flex flex-col gap-6">
          {/* Documents Section */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
              <FileText className="h-4 w-4 text-indigo-600" />
              Documentação
            </h2>

            {perfil.documentos.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sem registos</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {perfil.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        {doc.tipo}
                      </span>
                    </div>
                    <DocBadge status={doc.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info / Legend */}
          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">INFO ADICIONAL</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-indigo-600 opacity-60" />
                <span className="text-xs text-indigo-900/60 dark:text-indigo-300/60 font-medium">Os módulos apresentados são extraídos diretamente do currículo oficial do curso atribuído.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 opacity-60" />
                <span className="text-xs text-indigo-900/60 dark:text-indigo-300/60 font-medium">A média final é calculada com base nos módulos avaliados até ao momento.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

