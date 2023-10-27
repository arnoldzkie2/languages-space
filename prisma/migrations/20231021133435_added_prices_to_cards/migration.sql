/*
  Warnings:

  - You are about to drop the `_clientcardlisttosupplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `_clientcardlisttosupplier`;

-- CreateTable
CREATE TABLE `SupplierPrice` (
    `id` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `cardID` VARCHAR(191) NOT NULL,

    INDEX `SupplierPrice_supplierID_idx`(`supplierID`),
    INDEX `SupplierPrice_cardID_idx`(`cardID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
