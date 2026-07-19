-- CreateTable
CREATE TABLE "public"."Subcategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subcategory_categoryId_idx" ON "public"."Subcategory"("categoryId");

-- CreateIndex
CREATE INDEX "Subcategory_name_idx" ON "public"."Subcategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_categoryId_name_key" ON "public"."Subcategory"("categoryId", "name");

-- AddForeignKey
ALTER TABLE "public"."Subcategory"
ADD CONSTRAINT "Subcategory_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
