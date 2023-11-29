/*
  Warnings:

  - You are about to alter the column `profile` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `Client` MODIFY `profile` JSON NULL;
