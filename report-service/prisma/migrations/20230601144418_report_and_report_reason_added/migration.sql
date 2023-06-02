-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('SERVICE', 'USER');

-- CreateTable
CREATE TABLE "ServiceReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportReasonId" TEXT NOT NULL,

    CONSTRAINT "ServiceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportReason" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,

    CONSTRAINT "ReportReason_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceReport" ADD CONSTRAINT "ServiceReport_reportReasonId_fkey" FOREIGN KEY ("reportReasonId") REFERENCES "ReportReason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
