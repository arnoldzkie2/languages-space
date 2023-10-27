/*
  Warnings:

  - You are about to alter the column `price` on the `clientcard` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `clientCardId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `clientCardId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `clientcard` MODIFY `price` DOUBLE NOT NULL;

-- CreateIndex
CREATE INDEX `Booking_clientCardId_idx` ON `Booking`(`clientCardId`);
