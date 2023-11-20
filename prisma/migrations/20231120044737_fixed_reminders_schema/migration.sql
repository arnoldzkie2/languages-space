/*
  Warnings:

  - You are about to drop the `_DepartmentToReminders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departmentID` to the `Reminders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Reminders` ADD COLUMN `departmentID` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_DepartmentToReminders`;

-- CreateIndex
CREATE INDEX `Reminders_departmentID_idx` ON `Reminders`(`departmentID`);
