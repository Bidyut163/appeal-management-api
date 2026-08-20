/*
  Warnings:

  - The `fields` column on the `AppealRevert` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AppealRevert" DROP COLUMN "fields",
ADD COLUMN     "fields" TEXT[];
