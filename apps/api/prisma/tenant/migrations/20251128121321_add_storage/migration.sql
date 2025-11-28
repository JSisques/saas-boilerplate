-- CreateEnum
CREATE TYPE "StorageProviderEnum" AS ENUM ('S3', 'SUPABASE', 'SERVER_ROUTE');

-- CreateTable
CREATE TABLE "Storage" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "provider" "StorageProviderEnum" NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Storage_path_idx" ON "Storage"("path");

-- CreateIndex
CREATE INDEX "Storage_provider_idx" ON "Storage"("provider");
