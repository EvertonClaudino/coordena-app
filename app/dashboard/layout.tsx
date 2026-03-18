import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: session.user.role as "COORDENADOR" | "FORMADOR" | "FORMANDO",
    avatar: session.user.image ?? undefined,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AppSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
