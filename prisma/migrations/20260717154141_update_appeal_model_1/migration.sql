/*
  Warnings:

  - You are about to drop the column `description` on the `Appeal` table. All the data in the column will be lost.
  - Added the required column `appellantEmailAddress` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantMobileNumber` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantName` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantResidentialAddressLine1` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantResidentialCity` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantResidentialCountry` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantResidentialDistrict` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantResidentialPinCode` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantResidentialState` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantServiceAddressLine1` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantServiceCity` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantServiceCountry` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantServiceDistrict` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantServicePinCode` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appellantServiceState` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `factsOfCase` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groundsOfAppeal` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFiledWithinLimitation` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isMatterPendingInCourt` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reliefSought` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentEmailAddress` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentMobileNumber` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentName` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentOfficeAddressLine1` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentOfficeCity` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentOfficeCountry` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentOfficeDistrict` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentOfficePinCode` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentOfficeState` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentServiceAddressLine1` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentServiceCity` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentServiceCountry` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentServiceDistrict` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentServicePinCode` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `respondentServiceState` to the `Appeal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appeal" DROP COLUMN "description",
ADD COLUMN     "appellantEmailAddress" TEXT NOT NULL,
ADD COLUMN     "appellantMobileNumber" TEXT NOT NULL,
ADD COLUMN     "appellantName" TEXT NOT NULL,
ADD COLUMN     "appellantResidentialAddressLine1" TEXT NOT NULL,
ADD COLUMN     "appellantResidentialAddressLine2" TEXT,
ADD COLUMN     "appellantResidentialCity" TEXT NOT NULL,
ADD COLUMN     "appellantResidentialCountry" TEXT NOT NULL,
ADD COLUMN     "appellantResidentialDistrict" TEXT NOT NULL,
ADD COLUMN     "appellantResidentialLandmark" TEXT,
ADD COLUMN     "appellantResidentialPinCode" TEXT NOT NULL,
ADD COLUMN     "appellantResidentialState" TEXT NOT NULL,
ADD COLUMN     "appellantServiceAddressLine1" TEXT NOT NULL,
ADD COLUMN     "appellantServiceAddressLine2" TEXT,
ADD COLUMN     "appellantServiceCity" TEXT NOT NULL,
ADD COLUMN     "appellantServiceCountry" TEXT NOT NULL,
ADD COLUMN     "appellantServiceDistrict" TEXT NOT NULL,
ADD COLUMN     "appellantServiceLandmark" TEXT,
ADD COLUMN     "appellantServicePinCode" TEXT NOT NULL,
ADD COLUMN     "appellantServiceState" TEXT NOT NULL,
ADD COLUMN     "delayReason" TEXT,
ADD COLUMN     "factsOfCase" TEXT NOT NULL,
ADD COLUMN     "groundsOfAppeal" TEXT NOT NULL,
ADD COLUMN     "interimReliefRequested" TEXT,
ADD COLUMN     "isFiledWithinLimitation" BOOLEAN NOT NULL,
ADD COLUMN     "isMatterPendingInCourt" BOOLEAN NOT NULL,
ADD COLUMN     "projectRegistrationNumber" TEXT,
ADD COLUMN     "reliefSought" TEXT NOT NULL,
ADD COLUMN     "respondentEmailAddress" TEXT NOT NULL,
ADD COLUMN     "respondentMobileNumber" TEXT NOT NULL,
ADD COLUMN     "respondentName" TEXT NOT NULL,
ADD COLUMN     "respondentOfficeAddressLine1" TEXT NOT NULL,
ADD COLUMN     "respondentOfficeAddressLine2" TEXT,
ADD COLUMN     "respondentOfficeCity" TEXT NOT NULL,
ADD COLUMN     "respondentOfficeCountry" TEXT NOT NULL,
ADD COLUMN     "respondentOfficeDistrict" TEXT NOT NULL,
ADD COLUMN     "respondentOfficeLandmark" TEXT,
ADD COLUMN     "respondentOfficePinCode" TEXT NOT NULL,
ADD COLUMN     "respondentOfficeState" TEXT NOT NULL,
ADD COLUMN     "respondentServiceAddressLine1" TEXT NOT NULL,
ADD COLUMN     "respondentServiceAddressLine2" TEXT,
ADD COLUMN     "respondentServiceCity" TEXT NOT NULL,
ADD COLUMN     "respondentServiceCountry" TEXT NOT NULL,
ADD COLUMN     "respondentServiceDistrict" TEXT NOT NULL,
ADD COLUMN     "respondentServiceLandmark" TEXT,
ADD COLUMN     "respondentServicePinCode" TEXT NOT NULL,
ADD COLUMN     "respondentServiceState" TEXT NOT NULL;
