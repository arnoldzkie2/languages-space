/*
  Warnings:

  - You are about to drop the column `quantity` on the `ClientCard` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ClientCardList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ClientCard` DROP COLUMN `quantity`;

-- AlterTable
ALTER TABLE `ClientCardList` DROP COLUMN `quantity`;
