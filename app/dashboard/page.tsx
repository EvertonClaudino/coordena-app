import { redirect } from "next/navigation";
import { CoordenadorDashboard } from "@/app/dashboard/_components/coordenador-dashboard";
import { FormadorDashboard } from "@/app/dashboard/_components/formador-dashboard";
import { FormandoDashboard } from "@/app/dashboard/_components/formando-dashboard";
import { UserRole } from "@/components/app-sidebar";

// ─── Substitui pelo teu sistema de auth ──────────────────────────────────────
async function getAuthUser(): Promise<{ name: string; role: UserRole } | null> {
  return { name: "Carlos Mendes", role: "formando" };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  if (user.role === "coordenador") {
    return <CoordenadorDashboard userName={user.name} />;
  }

  if (user.role === "formador") {
    return <FormadorDashboard userName={user.name} />;
  }

  if (user.role === "formando") {
    return <FormandoDashboard userName={user.name} />;
  }

  redirect("/login");
}