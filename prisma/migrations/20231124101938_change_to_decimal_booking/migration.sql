/*
  Warnings:

  - You are about to alter the column `price` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `price` on the `Reminders` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `Booking` MODIFY `price` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Reminders` MODIFY `price` DECIMAL(65, 30) NULL;
