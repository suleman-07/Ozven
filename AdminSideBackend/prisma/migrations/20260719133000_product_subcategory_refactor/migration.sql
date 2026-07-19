-- Drop foreign keys from Product to removed taxonomy tables
ALTER TABLE "public"."Product" DROP CONSTRAINT IF EXISTS "Product_industryId_fkey";
ALTER TABLE "public"."Product" DROP CONSTRAINT IF EXISTS "Product_boxStyleId_fkey";
ALTER TABLE "public"."Product" DROP CONSTRAINT IF EXISTS "Product_materialId_fkey";
ALTER TABLE "public"."Product" DROP CONSTRAINT IF EXISTS "Product_finishId_fkey";
ALTER TABLE "public"."Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";

-- Drop Product indexes for removed columns
DROP INDEX IF EXISTS "public"."Product_industryId_idx";
DROP INDEX IF EXISTS "public"."Product_boxStyleId_idx";
DROP INDEX IF EXISTS "public"."Product_materialId_idx";
DROP INDEX IF EXISTS "public"."Product_finishId_idx";
DROP INDEX IF EXISTS "public"."Product_categoryId_idx";

-- Clear existing products (schema relationship change is breaking)
DELETE FROM "public"."ProductImage";
DELETE FROM "public"."QuoteRequest";
DELETE FROM "public"."Product";

-- Drop removed columns
ALTER TABLE "public"."Product" DROP COLUMN IF EXISTS "industryId";
ALTER TABLE "public"."Product" DROP COLUMN IF EXISTS "boxStyleId";
ALTER TABLE "public"."Product" DROP COLUMN IF EXISTS "materialId";
ALTER TABLE "public"."Product" DROP COLUMN IF EXISTS "finishId";
ALTER TABLE "public"."Product" DROP COLUMN IF EXISTS "categoryId";

-- Add new Product columns
ALTER TABLE "public"."Product" ADD COLUMN "sku" TEXT;
ALTER TABLE "public"."Product" ADD COLUMN "stockQuantity" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "public"."Product" ADD COLUMN "minOrderQuantity" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "public"."Product" ADD COLUMN "dimensions" TEXT;
ALTER TABLE "public"."Product" ADD COLUMN "subcategoryId" UUID NOT NULL;

-- Product indexes and constraints
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");
CREATE INDEX "Product_subcategoryId_idx" ON "public"."Product"("subcategoryId");
CREATE INDEX "Product_stockQuantity_idx" ON "public"."Product"("stockQuantity");
CREATE INDEX "ProductImage_productId_idx" ON "public"."ProductImage"("productId");

ALTER TABLE "public"."Product"
ADD CONSTRAINT "Product_subcategoryId_fkey"
FOREIGN KEY ("subcategoryId") REFERENCES "public"."Subcategory"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop unused taxonomy tables
DROP TABLE IF EXISTS "public"."Industry";
DROP TABLE IF EXISTS "public"."BoxStyle";
DROP TABLE IF EXISTS "public"."Material";
DROP TABLE IF EXISTS "public"."Finish";
