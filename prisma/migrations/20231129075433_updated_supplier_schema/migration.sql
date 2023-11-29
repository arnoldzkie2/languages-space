/*
  Warnings:

  - You are about to drop the column `profile` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Supplier` DROP COLUMN `profile`,
    ADD COLUMN `profile_key` VARCHAR(191) NULL,
    ADD COLUMN `profile_url` VARCHAR(191) NULL;
