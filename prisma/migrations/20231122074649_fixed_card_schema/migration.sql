/*
  Warnings:

  - Made the column `departmentID` on table `ClientCardList` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ClientCardList` MODIFY `departmentID` VARCHAR(191) NOT NULL;
