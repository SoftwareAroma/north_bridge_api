/*
  Warnings:

  - You are about to drop the column `slug` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salt" TEXT;
