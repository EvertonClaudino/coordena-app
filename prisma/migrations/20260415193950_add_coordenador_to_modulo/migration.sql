-- AlterTable
ALTER TABLE "Modulo" ADD COLUMN     "coordenadorId" TEXT;

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_coordenadorId_fkey" FOREIGN KEY ("coordenadorId") REFERENCES "Coordenador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
