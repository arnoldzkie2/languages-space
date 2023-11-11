/*
  Warnings:

  - Added the required column `courseID` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `courseID` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Booking_courseID_idx` ON `Booking`(`courseID`);
