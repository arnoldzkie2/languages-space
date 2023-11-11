/*
  Warnings:

  - You are about to drop the column `online_purchases` on the `ClientCardList` table. All the data in the column will be lost.
  - Added the required column `available` to the `ClientCardList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ClientCardList` DROP COLUMN `online_purchases`,
    ADD COLUMN `available` BOOLEAN NOT NULL;
