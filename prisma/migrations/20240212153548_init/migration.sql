/*
  Warnings:

  - Made the column `vendorId` on table `Store` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "vendorId" SET NOT NULL;
