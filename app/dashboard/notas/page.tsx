import { redirect } from "next/navigation";
import { UserRole } from "@/components/app-sidebar";
import FormandoNotas  from "./_components/formando-notas";
import FormadorNotas  from "./_components/formador-notas";

async function getAuthUser(): Promise<{ name: string; role: UserRole } | null> {
  return { name: "Ana Rodrigues", role: "formando" };
}

export default async function NotasPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  if (user.role === "formando") return <FormandoNotas />;
  
  if (user.role === "formador") return <FormadorNotas />;


  redirect("/dashboard");
}