/*
  Warnings:

  - You are about to drop the column `employment_status` on the `supplier` table. All the data in the column will be lost.
  - Added the required column `status` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Made the column `note` on table `supplier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `employment_status`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    MODIFY `note` VARCHAR(191) NOT NULL;
