-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('VALID', 'NEEDS_REVIEW', 'REJECTED');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "validationIssues" JSONB,
ADD COLUMN     "validationStatus" "ValidationStatus";

-- AlterTable
ALTER TABLE "ImportRecord" ADD COLUMN     "dryRun" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "needsReview" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rejected" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requestedLimit" INTEGER;
