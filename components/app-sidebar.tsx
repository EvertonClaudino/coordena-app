"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Puzzle, Users, GraduationCap,
  CalendarDays, FileText, LogOut, User, ClipboardList, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type UserRole = "coordenador" | "formador" | "formando";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  // Todos
  { label: "Dashboard",          href: "/dashboard",                     icon: LayoutDashboard, roles: ["coordenador", "formador", "formando"] },
  // Formador
  { label: "O Meu Perfil",       href: "/dashboard/perfil",              icon: User,            roles: ["formador"] },
  { label: "Disponibilidades",   href: "/dashboard/disponibilidades",    icon: CalendarDays,    roles: ["formador"] },
  { label: "Módulos Atribuídos", href: "/dashboard/modulos-atribuidos",  icon: BookOpen,        roles: ["formador"] },
  { label: "Notas de Alunos",    href: "/dashboard/notas",               icon: ClipboardList,   roles: ["formador"] },
  { label: "Documentos",         href: "/dashboard/documentos",          icon: FileText,        roles: ["formador", "coordenador"] },
  { label: "Convites",           href: "/dashboard/convites",            icon: Mail,            roles: ["formador"] },
  // Coordenador
  { label: "Cursos",             href: "/dashboard/cursos",              icon: BookOpen,        roles: ["coordenador"] },
  { label: "Módulos",            href: "/dashboard/modulos",             icon: Puzzle,          roles: ["coordenador"] },
  { label: "Formadores",         href: "/dashboard/formadores",          icon: Users,           roles: ["coordenador"] },
  { label: "Formandos",          href: "/dashboard/formandos",           icon: GraduationCap,   roles: ["coordenador"] },
  { label: "Calendário",         href: "/dashboard/calendario",          icon: CalendarDays,    roles: ["coordenador", "formador", "formando"] },
  // Formando
  { label: "Os Meus Cursos",     href: "/dashboard/meus-cursos",         icon: BookOpen,        roles: ["formando"] },
  { label: "Minhas Notas",       href: "/dashboard/notas",               icon: ClipboardList,   roles: ["formando"] },


];

const ROLE_CONFIG: Record<UserRole, { label: string; active: string; logo: string; color: string }> = {
  coordenador: { label: "COORDENADOR", active: "bg-indigo-600 text-white", logo: "bg-indigo-600", color: "#4f46e5" },
  formador:    { label: "FORMADOR",    active: "bg-purple-600 text-white", logo: "bg-purple-600", color: "#9333ea" },
  formando:    { label: "FORMANDO",    active: "bg-teal-500 text-white",   logo: "bg-teal-500",   color: "#14b8a6" },
};

interface AppSidebarProps {
  user: { name: string; email: string; role: UserRole; avatar?: string };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const cfg      = ROLE_CONFIG[user.role];
  const visible  = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  function handleLogout() {
    // Com NextAuth:  signOut({ callbackUrl: "/login" })
    // Com Clerk:     signOut(() => router.push("/login"))
    // Com Supabase:  await supabase.auth.signOut(); router.push("/login")
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-[268px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", cfg.logo)}>
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-gray-900 leading-tight">Coordena</span>
          <span className="text-[10px] font-semibold tracking-widest" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1 overflow-y-auto">
        {visible.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? cfg.active
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all curssors-pointer"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          Terminar sessão
        </button>
      </div>
    </aside>
  );
}