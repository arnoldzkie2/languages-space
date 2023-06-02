/*
  Warnings:

  - Added the required column `email` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `SuperAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `agent` ADD COLUMN `user_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `client` ADD COLUMN `user_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `superadmin` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `user_name` VARCHAR(191) NOT NULL;
