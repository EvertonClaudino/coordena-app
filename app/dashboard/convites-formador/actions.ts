"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function responderConviteFormador(conviteId: string, acao: "ACEITE" | "RECUSADO") {
  try {
    await prisma.convite.update({
      where: { id: conviteId },
      data: {
        status: acao,
        dataResposta: new Date(),
      },
    });

    revalidatePath("/dashboard/convites-formador");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao responder convite:", error);
    return { success: false, error: "Falha ao processar resposta" };
  }
}
