/*
  Warnings:

  - Made the column `quantity` on table `ClientCard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `ClientCardList` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ClientCard` MODIFY `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ClientCardList` MODIFY `quantity` INTEGER NOT NULL;
