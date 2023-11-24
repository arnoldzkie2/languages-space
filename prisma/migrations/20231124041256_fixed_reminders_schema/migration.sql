/*
  Warnings:

  - Made the column `departmentID` on table `Reminders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Reminders` MODIFY `departmentID` VARCHAR(191) NOT NULL;
