import { redirect } from "next/navigation";
import { UserRole } from "@/components/app-sidebar";
import { FormadorDocumentos } from "./_components/formador-documentos";
import { CoordenadorDocumentos } from "./_components/coordenador-documentos";

async function getAuthUser(): Promise<{ name: string; role: UserRole } | null> {
  return { name: "Ana Rodrigues", role: "coordenador" };
}

export default async function DocumentosPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  if (user.role === "coordenador") return <CoordenadorDocumentos />;
  if (user.role === "formador")    return <FormadorDocumentos />;

  redirect("/dashboard");
}