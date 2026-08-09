-- CreateTable
CREATE TABLE "ClientLogo" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientLogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientLogo_isActive_displayOrder_idx" ON "ClientLogo"("isActive", "displayOrder");

-- CreateIndex
CREATE INDEX "ClientLogo_name_idx" ON "ClientLogo"("name");
