/*
  Warnings:

  - You are about to drop the column `card_id` on the `clientcardlist` table. All the data in the column will be lost.
  - Added the required column `card_id` to the `ClientCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clientcard` ADD COLUMN `card_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `clientcardlist` DROP COLUMN `card_id`;
