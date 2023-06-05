/*
  Warnings:

  - You are about to drop the column `department_name` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `department_name` on the `agent` table. All the data in the column will be lost.
  - You are about to drop the column `card` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `department_name` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `department_name` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `postpaidcard` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `prepaidcard` table. All the data in the column will be lost.
  - You are about to drop the column `department_name` on the `supplier` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_department_name_fkey`;

-- DropForeignKey
ALTER TABLE `agent` DROP FOREIGN KEY `Agent_department_name_fkey`;

-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `Client_department_name_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_department_name_fkey`;

-- DropForeignKey
ALTER TABLE `postpaidcard` DROP FOREIGN KEY `PostpaidCard_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `prepaidcard` DROP FOREIGN KEY `PrepaidCard_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `supplier` DROP FOREIGN KEY `Supplier_department_name_fkey`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `department_name`;

-- AlterTable
ALTER TABLE `agent` DROP COLUMN `department_name`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `card`,
    DROP COLUMN `department_name`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `department_name`;

-- AlterTable
ALTER TABLE `postpaidcard` DROP COLUMN `client_id`,
    ADD COLUMN `client_card_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `prepaidcard` DROP COLUMN `client_id`,
    ADD COLUMN `clien_card_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `department_name`;

-- CreateTable
CREATE TABLE `ClientDepartment` (
    `id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCard` (
    `id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierDepartment` (
    `id` VARCHAR(191) NOT NULL,
    `supplier_id` VARCHAR(191) NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentDepartment` (
    `id` VARCHAR(191) NOT NULL,
    `agent_id` VARCHAR(191) NULL,
    `department_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDepartment` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NULL,
    `department_id` VARCHAR(191) NULL,

    UNIQUE INDEX `OrderDepartment_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminDepartment` (
    `id` VARCHAR(191) NOT NULL,
    `admin_id` VARCHAR(191) NULL,
    `department_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClientDepartment` ADD CONSTRAINT `ClientDepartment_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientDepartment` ADD CONSTRAINT `ClientDepartment_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientCard` ADD CONSTRAINT `ClientCard_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostpaidCard` ADD CONSTRAINT `PostpaidCard_client_card_id_fkey` FOREIGN KEY (`client_card_id`) REFERENCES `ClientCard`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrepaidCard` ADD CONSTRAINT `PrepaidCard_clien_card_id_fkey` FOREIGN KEY (`clien_card_id`) REFERENCES `ClientCard`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierDepartment` ADD CONSTRAINT `SupplierDepartment_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierDepartment` ADD CONSTRAINT `SupplierDepartment_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentDepartment` ADD CONSTRAINT `AgentDepartment_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `Agent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentDepartment` ADD CONSTRAINT `AgentDepartment_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDepartment` ADD CONSTRAINT `OrderDepartment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDepartment` ADD CONSTRAINT `OrderDepartment_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminDepartment` ADD CONSTRAINT `AdminDepartment_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminDepartment` ADD CONSTRAINT `AdminDepartment_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
