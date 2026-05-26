/*
  Warnings:

  - The values [PENDING,WITH_OFFICIALS,APPROVED] on the enum `AppealStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [OFFICIAL] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppealStatus_new" AS ENUM ('DRAFT', 'UNDER_VERIFICATION', 'WITH_REGISTRAR', 'REVERTED_TO_APPELLANT', 'UNDER_HEARING', 'CLOSED', 'REJECTED');
ALTER TABLE "public"."Appeal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Appeal" ALTER COLUMN "status" TYPE "AppealStatus_new" USING ("status"::text::"AppealStatus_new");
ALTER TYPE "AppealStatus" RENAME TO "AppealStatus_old";
ALTER TYPE "AppealStatus_new" RENAME TO "AppealStatus";
DROP TYPE "public"."AppealStatus_old";
ALTER TABLE "Appeal" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RoleType_new" AS ENUM ('ADMIN', 'REGISTRAR', 'VERIFIER', 'APPELLANT');
ALTER TABLE "Role" ALTER COLUMN "name" TYPE "RoleType_new" USING ("name"::text::"RoleType_new");
ALTER TYPE "RoleType" RENAME TO "RoleType_old";
ALTER TYPE "RoleType_new" RENAME TO "RoleType";
DROP TYPE "public"."RoleType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Appeal" ADD COLUMN     "registrarComments" TEXT,
ADD COLUMN     "verifierComments" TEXT,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';
