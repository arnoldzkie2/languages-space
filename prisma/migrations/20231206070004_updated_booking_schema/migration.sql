/*
  Warnings:

  - You are about to drop the column `bookingID` on the `SupplierSchedule` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `SupplierSchedule_bookingID_idx` ON `SupplierSchedule`;

-- AlterTable
ALTER TABLE `SupplierSchedule` DROP COLUMN `bookingID`;

-- CreateIndex
CREATE INDEX `Booking_scheduleID_idx` ON `Booking`(`scheduleID`);
