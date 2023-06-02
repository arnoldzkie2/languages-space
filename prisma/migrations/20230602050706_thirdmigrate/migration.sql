/*
  Warnings:

  - The primary key for the `agent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `agent` table. All the data in the column will be lost.
  - The primary key for the `agentcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `agentcard` table. All the data in the column will be lost.
  - The primary key for the `client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `client` table. All the data in the column will be lost.
  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `order` table. All the data in the column will be lost.
  - The primary key for the `postpaidcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `postpaidcard` table. All the data in the column will be lost.
  - The primary key for the `prepaidcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `prepaidcard` table. All the data in the column will be lost.
  - The primary key for the `supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `supplier` table. All the data in the column will be lost.
  - The primary key for the `suppliercard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `suppliercard` table. All the data in the column will be lost.
  - The primary key for the `suppliercardtype` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashed_id` on the `suppliercardtype` table. All the data in the column will be lost.
  - The required column `id` was added to the `Agent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `AgentCard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Client` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `PostpaidCard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `PrepaidCard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Supplier` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `SupplierCard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `SupplierCardType` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `postpaidcard` DROP FOREIGN KEY `PostpaidCard_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `prepaidcard` DROP FOREIGN KEY `PrepaidCard_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `suppliercardtype` DROP FOREIGN KEY `SupplierCardType_supplierCardId_fkey`;

-- AlterTable
ALTER TABLE `agent` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `agentcard` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `client` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `postpaidcard` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `prepaidcard` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `supplier` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `suppliercard` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `suppliercardtype` DROP PRIMARY KEY,
    DROP COLUMN `hashed_id`,
    ADD COLUMN `id` VARCHAR(256) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `PostpaidCard` ADD CONSTRAINT `PostpaidCard_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrepaidCard` ADD CONSTRAINT `PrepaidCard_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierCardType` ADD CONSTRAINT `SupplierCardType_supplierCardId_fkey` FOREIGN KEY (`supplierCardId`) REFERENCES `SupplierCard`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
