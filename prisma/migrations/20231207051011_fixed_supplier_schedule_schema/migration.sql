/*
  Warnings:

  - You are about to drop the column `clientName` on the `SupplierSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `remindersID` on the `SupplierSchedule` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `SupplierSchedule_remindersID_idx` ON `SupplierSchedule`;

-- AlterTable
ALTER TABLE `SupplierSchedule` DROP COLUMN `clientName`,
    DROP COLUMN `remindersID`,
    ADD COLUMN `clientUsername` VARCHAR(191) NULL;
