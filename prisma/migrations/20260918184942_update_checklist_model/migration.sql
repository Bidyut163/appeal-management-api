/*
  Warnings:

  - You are about to drop the column `sectionNumber` on the `AppealChecklist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appealNumber]` on the table `Appeal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AppealChecklist" DROP CONSTRAINT "AppealChecklist_appealId_fkey";

-- AlterTable
ALTER TABLE "Appeal" ADD COLUMN     "appealNumber" TEXT;

-- AlterTable
ALTER TABLE "AppealChecklist" DROP COLUMN "sectionNumber",
ADD COLUMN     "appealFilingDelayDays" INTEGER,
ADD COLUMN     "areDocumentsFiledWithIndexPagination" BOOLEAN,
ADD COLUMN     "areDocumentsLegible" BOOLEAN,
ADD COLUMN     "areFeesPaid" BOOLEAN,
ADD COLUMN     "arePartiesAndAddressesProper" BOOLEAN,
ADD COLUMN     "certifiedCopyApplicationDate" TIMESTAMP(3),
ADD COLUMN     "certifiedCopyReadyDate" TIMESTAMP(3),
ADD COLUMN     "certifiedCopyReceiptDate" TIMESTAMP(3),
ADD COLUMN     "communicationDate" TIMESTAMP(3),
ADD COLUMN     "hardCopyDelayDays" INTEGER,
ADD COLUMN     "hardCopySubmissionDate" TIMESTAMP(3),
ADD COLUMN     "isAppealCompetent" BOOLEAN,
ADD COLUMN     "isAppealFilingDelayed" BOOLEAN,
ADD COLUMN     "isAppealMemoAnnexedForOtherSide" BOOLEAN,
ADD COLUMN     "isAppealMemoServedByPostCourier" BOOLEAN,
ADD COLUMN     "isAppealWithinLimitation" BOOLEAN,
ADD COLUMN     "isCertifiedCopyFiled" BOOLEAN,
ADD COLUMN     "isCondonationApplicationFiled" BOOLEAN,
ADD COLUMN     "isContactOnRecord" BOOLEAN,
ADD COLUMN     "isHardCopySubmissionDelayed" BOOLEAN,
ADD COLUMN     "isPaymentReceiptFiled" BOOLEAN,
ADD COLUMN     "isVakalatnamaAuthorizationProper" BOOLEAN,
ADD COLUMN     "legalProvision" TEXT,
ADD COLUMN     "onlineFilingDate" TIMESTAMP(3),
ADD COLUMN     "orderDate" TIMESTAMP(3),
ADD COLUMN     "paymentDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Appeal_appealNumber_key" ON "Appeal"("appealNumber");

-- AddForeignKey
ALTER TABLE "AppealChecklist" ADD CONSTRAINT "AppealChecklist_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
