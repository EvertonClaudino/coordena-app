-- DropForeignKey
ALTER TABLE "Modulo" DROP CONSTRAINT "Modulo_cursoId_fkey";

-- AlterTable
ALTER TABLE "Modulo" ALTER COLUMN "cursoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
