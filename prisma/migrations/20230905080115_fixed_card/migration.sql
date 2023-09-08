/*
  Warnings:

  - You are about to alter the column `price` on the `clientcard` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `balance` on the `clientcard` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `clientcardlist` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `balance` on the `clientcardlist` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `clientcard` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `balance` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `clientcardlist` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `balance` DOUBLE NOT NULL;
