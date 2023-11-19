/*
  Warnings:

  - You are about to drop the `_BookingToDepartment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departmentID` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `departmentID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SupplierSchedule` ADD COLUMN `remindersID` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_BookingToDepartment`;

-- CreateTable
CREATE TABLE `Reminders` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `scheduleID` VARCHAR(191) NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,
    `clientCardID` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `meeting_info` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `courseID` VARCHAR(191) NOT NULL,

    INDEX `Reminders_supplierID_idx`(`supplierID`),
    INDEX `Reminders_clientID_idx`(`clientID`),
    INDEX `Reminders_courseID_idx`(`courseID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DepartmentToReminders` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DepartmentToReminders_AB_unique`(`A`, `B`),
    INDEX `_DepartmentToReminders_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Booking_departmentID_idx` ON `Booking`(`departmentID`);

-- CreateIndex
CREATE INDEX `SupplierSchedule_remindersID_idx` ON `SupplierSchedule`(`remindersID`);
