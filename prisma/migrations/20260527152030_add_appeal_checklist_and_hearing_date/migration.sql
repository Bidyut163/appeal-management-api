-- AlterTable
ALTER TABLE "Appeal" ADD COLUMN     "hearingDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AppealChecklist" (
    "id" SERIAL NOT NULL,
    "appealId" INTEGER NOT NULL,
    "complaintNumber" TEXT,
    "sectionNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppealChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppealChecklist_appealId_key" ON "AppealChecklist"("appealId");

-- AddForeignKey
ALTER TABLE "AppealChecklist" ADD CONSTRAINT "AppealChecklist_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
