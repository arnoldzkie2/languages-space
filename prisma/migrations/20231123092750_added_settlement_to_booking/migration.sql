/*
  Warnings:

  - Added the required column `settlement` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settlement` to the `Reminders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `settlement` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Reminders` ADD COLUMN `settlement` VARCHAR(191) NOT NULL;
