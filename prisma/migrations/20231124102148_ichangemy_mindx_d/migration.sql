/*
  Warnings:

  - You are about to alter the column `price` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `price` on the `Reminders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Booking` MODIFY `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Reminders` MODIFY `price` INTEGER NULL;
