-- CreateEnum
CREATE TYPE "AppealDocumentType" AS ENUM ('APPEAL');

-- CreateTable
CREATE TABLE "AppealDocument" (
    "id" SERIAL NOT NULL,
    "appealId" INTEGER NOT NULL,
    "documentType" "AppealDocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppealDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppealDocument" ADD CONSTRAINT "AppealDocument_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
