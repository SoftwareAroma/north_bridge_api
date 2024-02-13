/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `StoreCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProductCategory" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StoreCategory" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "storeId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StoreCategory_name_key" ON "StoreCategory"("name");
