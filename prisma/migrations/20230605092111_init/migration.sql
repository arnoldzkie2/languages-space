/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `department_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `agent` ADD COLUMN `department_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `client` ADD COLUMN `department_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `department_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `department_name` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Department_name_key` ON `Department`(`name`);

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_department_name_fkey` FOREIGN KEY (`department_name`) REFERENCES `Department`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_department_name_fkey` FOREIGN KEY (`department_name`) REFERENCES `Department`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent` ADD CONSTRAINT `Agent_department_name_fkey` FOREIGN KEY (`department_name`) REFERENCES `Department`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_department_name_fkey` FOREIGN KEY (`department_name`) REFERENCES `Department`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_department_name_fkey` FOREIGN KEY (`department_name`) REFERENCES `Department`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
