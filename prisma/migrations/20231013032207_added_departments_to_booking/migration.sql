/*
  Warnings:

  - You are about to drop the column `date` on the `department` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `department` DROP COLUMN `date`;

-- CreateTable
CREATE TABLE `_BookingToDepartment` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BookingToDepartment_AB_unique`(`A`, `B`),
    INDEX `_BookingToDepartment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
