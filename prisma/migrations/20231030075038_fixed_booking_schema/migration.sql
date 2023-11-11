/*
  Warnings:

  - You are about to drop the column `reserved` on the `SupplierSchedule` table. All the data in the column will be lost.
  - Added the required column `status` to the `SupplierSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Booking_clientCardID_idx` ON `Booking`;

-- DropIndex
DROP INDEX `Booking_meetingInfoID_idx` ON `Booking`;

-- DropIndex
DROP INDEX `Booking_scheduleID_idx` ON `Booking`;

-- AlterTable
ALTER TABLE `SupplierSchedule` DROP COLUMN `reserved`,
    ADD COLUMN `bookingID` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `SupplierSchedule_bookingID_idx` ON `SupplierSchedule`(`bookingID`);
