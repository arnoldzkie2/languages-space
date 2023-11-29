/*
  Warnings:

  - You are about to drop the `_DepartmentToOrder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departmentID` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `departmentID` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_DepartmentToOrder`;

-- CreateIndex
CREATE INDEX `Order_departmentID_idx` ON `Order`(`departmentID`);
