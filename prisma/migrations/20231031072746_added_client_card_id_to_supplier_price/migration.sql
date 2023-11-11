/*
  Warnings:

  - Added the required column `clientCardID` to the `SupplierPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SupplierPrice` ADD COLUMN `clientCardID` INTEGER NOT NULL;
