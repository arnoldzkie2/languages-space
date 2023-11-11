/*
  Warnings:

  - You are about to drop the column `meetingInfoID` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `meeting_info` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `meetingInfoID`,
    ADD COLUMN `meeting_info` JSON NOT NULL;
