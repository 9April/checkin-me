-- AlterTable
ALTER TABLE "Property" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");
