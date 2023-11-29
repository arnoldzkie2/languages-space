/*
  Warnings:

  - You are about to drop the column `profile` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Client` DROP COLUMN `profile`,
    ADD COLUMN `profile_key` VARCHAR(191) NULL,
    ADD COLUMN `profile_url` TEXT NULL;
