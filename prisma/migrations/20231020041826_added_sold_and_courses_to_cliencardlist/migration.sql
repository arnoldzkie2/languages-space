/*
  Warnings:

  - Added the required column `sold` to the `ClientCardList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clientcardlist` ADD COLUMN `sold` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Courses` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClientCardListToCourses` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ClientCardListToCourses_AB_unique`(`A`, `B`),
    INDEX `_ClientCardListToCourses_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClientCardListToSupplier` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ClientCardListToSupplier_AB_unique`(`A`, `B`),
    INDEX `_ClientCardListToSupplier_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
