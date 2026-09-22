/*
  Warnings:

  - You are about to drop the column `isPaymentReceiptFiled` on the `AppealChecklist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppealChecklist" DROP COLUMN "isPaymentReceiptFiled",
ADD COLUMN     "objectionForCondonationDelay" TEXT;
