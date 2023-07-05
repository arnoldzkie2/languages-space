-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `Client_agent_id_fkey`;

-- DropForeignKey
ALTER TABLE `suppliercardtype` DROP FOREIGN KEY `SupplierCardType_supplierCardId_fkey`;

-- DropForeignKey
ALTER TABLE `suppliertags` DROP FOREIGN KEY `SupplierTags_suplier_id_fkey`;

-- AlterTable
ALTER TABLE `news` ADD COLUMN `departments` JSON NULL;
