import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";

// Substitui pelo teu sistema de auth
async function getCurrentUser() {
  return {
    name: "Carlos Mendes",
    email: "carlos.mendes@coordena.pt",
    role: "formando" as const,
    avatar: undefined,
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AppSidebar user={user} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar user={user} notificationCount={3} />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}