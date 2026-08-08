/*
  Warnings:

  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UPI', 'CARD', 'NET_BANKING', 'WALLET');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_appealId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "orderId",
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
