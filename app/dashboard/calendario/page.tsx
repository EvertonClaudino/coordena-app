import { redirect } from "next/navigation";
import { UserRole } from "@/components/app-sidebar";
import  FormadorDocumentos  from "./_components/formador-calendario";
import CalendarioFormandoPage from "./_components/formando-calendario";
async function getAuthUser(): Promise<{ name: string; role: UserRole } | null> {
  return { name: "Ana Rodrigues", role: "formando" };
}

export default async function DocumentosPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  if (user.role === "formando") return <CalendarioFormandoPage />;
  if (user.role === "formador") return <FormadorDocumentos />;

  redirect("/dashboard");
}