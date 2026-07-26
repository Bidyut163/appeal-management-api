/*
  Warnings:

  - Added the required column `updatedAt` to the `AppealDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppealDocument" DROP CONSTRAINT "AppealDocument_appealId_fkey";

-- AlterTable
ALTER TABLE "AppealDocument" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "AppealDocument_appealId_documentType_idx" ON "AppealDocument"("appealId", "documentType");

-- AddForeignKey
ALTER TABLE "AppealDocument" ADD CONSTRAINT "AppealDocument_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
