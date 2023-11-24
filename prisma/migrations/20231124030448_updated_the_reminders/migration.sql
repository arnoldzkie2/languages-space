/*
  Warnings:

  - You are about to drop the column `scheduleID` on the `Reminders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Reminders` DROP COLUMN `scheduleID`,
    MODIFY `supplierID` VARCHAR(191) NULL,
    MODIFY `clientID` VARCHAR(191) NULL,
    MODIFY `clientCardID` VARCHAR(191) NULL,
    MODIFY `meeting_info` JSON NULL,
    MODIFY `courseID` VARCHAR(191) NULL,
    MODIFY `departmentID` VARCHAR(191) NULL,
    MODIFY `card_name` VARCHAR(191) NULL,
    MODIFY `settlement` VARCHAR(191) NULL;
