/*
  Warnings:

  - You are about to drop the column `name` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `canceled` on the `supplierschedule` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `supplierschedule` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `supplierschedule` table. All the data in the column will be lost.
  - You are about to drop the column `meeting_info` on the `supplierschedule` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `supplierschedule` table. All the data in the column will be lost.
  - Added the required column `card_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Order_schedule_id_idx` ON `order`;

-- DropIndex
DROP INDEX `SupplierSchedule_client_id_idx` ON `supplierschedule`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `name`,
    DROP COLUMN `schedule_id`,
    ADD COLUMN `card_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `client_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `supplierschedule` DROP COLUMN `canceled`,
    DROP COLUMN `client_id`,
    DROP COLUMN `completed`,
    DROP COLUMN `meeting_info`,
    DROP COLUMN `note`;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `schedule_id` VARCHAR(191) NOT NULL,
    `supplier_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,

    INDEX `Booking_schedule_id_idx`(`schedule_id`),
    INDEX `Booking_supplier_id_idx`(`supplier_id`),
    INDEX `Booking_client_id_idx`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Order_client_id_idx` ON `Order`(`client_id`);

-- CreateIndex
CREATE INDEX `Order_card_id_idx` ON `Order`(`card_id`);
