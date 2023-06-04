/*
  Warnings:

  - You are about to drop the column `status` on the `supplier` table. All the data in the column will be lost.
  - Added the required column `employment_status` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `status`,
    ADD COLUMN `employment_status` VARCHAR(191) NOT NULL;
