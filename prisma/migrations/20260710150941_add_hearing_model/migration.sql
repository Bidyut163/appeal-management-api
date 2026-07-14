/*
  Warnings:

  - The values [CLOSED] on the enum `AppealStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hearingDate` on the `Appeal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "HearingStatus" AS ENUM ('SCHEDULED', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "AppealStatus_new" AS ENUM ('DRAFT', 'UNDER_VERIFICATION', 'WITH_REGISTRAR', 'REVERTED_TO_APPELLANT', 'UNDER_HEARING', 'DISPOSED', 'REJECTED');
ALTER TABLE "public"."Appeal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Appeal" ALTER COLUMN "status" TYPE "AppealStatus_new" USING ("status"::text::"AppealStatus_new");
ALTER TYPE "AppealStatus" RENAME TO "AppealStatus_old";
ALTER TYPE "AppealStatus_new" RENAME TO "AppealStatus";
DROP TYPE "public"."AppealStatus_old";
ALTER TABLE "Appeal" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "Appeal" DROP COLUMN "hearingDate";

-- CreateTable
CREATE TABLE "Hearing" (
    "id" SERIAL NOT NULL,
    "appealId" INTEGER NOT NULL,
    "hearingNumber" INTEGER NOT NULL,
    "hearingDate" TIMESTAMP(3) NOT NULL,
    "status" "HearingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hearing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hearing_appealId_hearingNumber_key" ON "Hearing"("appealId", "hearingNumber");

-- AddForeignKey
ALTER TABLE "Hearing" ADD CONSTRAINT "Hearing_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
