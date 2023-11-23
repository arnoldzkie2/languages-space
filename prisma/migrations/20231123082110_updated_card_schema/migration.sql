/*
  Warnings:

  - You are about to drop the column `settlement_period` on the `ClientCard` table. All the data in the column will be lost.
  - You are about to drop the column `settlement_period` on the `ClientCardList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ClientCard` DROP COLUMN `settlement_period`;

-- AlterTable
ALTER TABLE `ClientCardList` DROP COLUMN `settlement_period`;
