/*
  Warnings:

  - Added the required column `quantity` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Reminders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Reminders` ADD COLUMN `quantity` INTEGER NOT NULL;
