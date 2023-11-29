/*
  Warnings:

  - You are about to drop the column `user_name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `SuperAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `SuperAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `SuperAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Admin_user_name_key` ON `Admin`;

-- DropIndex
DROP INDEX `Agent_user_name_key` ON `Agent`;

-- DropIndex
DROP INDEX `Client_user_name_key` ON `Client`;

-- DropIndex
DROP INDEX `SuperAdmin_user_name_key` ON `SuperAdmin`;

-- DropIndex
DROP INDEX `Supplier_user_name_key` ON `Supplier`;

-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `user_name`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Agent` DROP COLUMN `user_name`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Client` DROP COLUMN `user_name`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SuperAdmin` DROP COLUMN `user_name`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Supplier` DROP COLUMN `user_name`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_username_key` ON `Admin`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Agent_username_key` ON `Agent`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Client_username_key` ON `Client`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `SuperAdmin_username_key` ON `SuperAdmin`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_username_key` ON `Supplier`(`username`);
