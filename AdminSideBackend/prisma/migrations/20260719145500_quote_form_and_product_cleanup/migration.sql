-- Remove obsolete inventory fields and indexes from Product
DROP INDEX IF EXISTS "public"."Product_sku_key";
DROP INDEX IF EXISTS "public"."Product_stockQuantity_idx";

ALTER TABLE "public"."Product"
DROP COLUMN IF EXISTS "sku",
DROP COLUMN IF EXISTS "stockQuantity",
DROP COLUMN IF EXISTS "minOrderQuantity",
DROP COLUMN IF EXISTS "dimensions";

-- Expand QuoteRequest to support the customer quote form
ALTER TABLE "public"."QuoteRequest"
ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "color" TEXT NOT NULL DEFAULT 'Not specified',
ADD COLUMN "productName" TEXT NOT NULL DEFAULT 'General Quote',
ADD COLUMN "length" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "width" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "depth" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "unit" TEXT NOT NULL DEFAULT 'inch',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "QuoteRequest_productName_idx" ON "public"."QuoteRequest"("productName");
CREATE INDEX "QuoteRequest_createdAt_idx" ON "public"."QuoteRequest"("createdAt");
