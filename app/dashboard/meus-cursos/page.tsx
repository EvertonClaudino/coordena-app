import { redirect } from "next/navigation";
import { UserRole } from "@/components/app-sidebar";
import FormandoCurso from "./_components/formandos-meus-cursos";
import FormadorCursos from "./_components/formador-cursos";
async function getAuthUser(): Promise<{ name: string; role: UserRole } | null> {
  return { name: "Ana Rodrigues", role: "formando" };
}

export default async function DocumentosPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  if (user.role === "formando") return <FormandoCurso />;
  if (user.role === "formador") return <FormadorCursos />;

  redirect("/dashboard");
}