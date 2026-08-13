-- CreateEnum
CREATE TYPE "RevertStatus" AS ENUM ('OPEN', 'RESUBMITTED');

-- CreateTable
CREATE TABLE "AppealRevert" (
    "id" SERIAL NOT NULL,
    "appealId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "status" "RevertStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppealRevert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppealRevert_appealId_idx" ON "AppealRevert"("appealId");

-- CreateIndex
CREATE INDEX "AppealRevert_createdById_idx" ON "AppealRevert"("createdById");

-- CreateIndex
CREATE INDEX "AppealRevert_status_idx" ON "AppealRevert"("status");

-- AddForeignKey
ALTER TABLE "AppealRevert" ADD CONSTRAINT "AppealRevert_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppealRevert" ADD CONSTRAINT "AppealRevert_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
