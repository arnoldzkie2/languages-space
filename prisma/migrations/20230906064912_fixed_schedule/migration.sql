/*
  Warnings:

  - You are about to drop the column `meeting_id` on the `suppliermeetinginfo` table. All the data in the column will be lost.
  - You are about to drop the column `meeting_id` on the `supplierschedule` table. All the data in the column will be lost.
  - Added the required column `meeting_code` to the `SupplierMeetingInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `suppliermeetinginfo` DROP COLUMN `meeting_id`,
    ADD COLUMN `meeting_code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `supplierschedule` DROP COLUMN `meeting_id`;
