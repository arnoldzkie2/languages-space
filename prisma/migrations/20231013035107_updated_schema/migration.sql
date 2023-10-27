/*
  Warnings:

  - You are about to drop the column `agent_card_id` on the `agent` table. All the data in the column will be lost.
  - You are about to drop the column `clientCardId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `card_id` on the `clientcard` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `clientcard` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `clientcardlist` table. All the data in the column will be lost.
  - You are about to drop the column `product_price_id` on the `clientcardlist` table. All the data in the column will be lost.
  - You are about to drop the column `card_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `suppliermeetinginfo` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `supplierschedule` table. All the data in the column will be lost.
  - Added the required column `clientCardID` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientID` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingInfoID` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleID` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierID` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardID` to the `ClientCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientID` to the `ClientCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productID` to the `ClientCardList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPriceID` to the `ClientCardList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardID` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientID` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierID` to the `SupplierMeetingInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierID` to the `SupplierSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Agent_agent_card_id_idx` ON `agent`;

-- DropIndex
DROP INDEX `Booking_clientCardId_idx` ON `booking`;

-- DropIndex
DROP INDEX `Booking_client_id_idx` ON `booking`;

-- DropIndex
DROP INDEX `Booking_schedule_id_idx` ON `booking`;

-- DropIndex
DROP INDEX `Booking_supplier_id_idx` ON `booking`;

-- DropIndex
DROP INDEX `ClientCard_client_id_idx` ON `clientcard`;

-- DropIndex
DROP INDEX `Order_card_id_idx` ON `order`;

-- DropIndex
DROP INDEX `Order_client_id_idx` ON `order`;

-- DropIndex
DROP INDEX `SupplierMeetingInfo_supplier_id_idx` ON `suppliermeetinginfo`;

-- DropIndex
DROP INDEX `SupplierSchedule_supplier_id_idx` ON `supplierschedule`;

-- AlterTable
ALTER TABLE `agent` DROP COLUMN `agent_card_id`,
    ADD COLUMN `agentCardID` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `clientCardId`,
    DROP COLUMN `client_id`,
    DROP COLUMN `schedule_id`,
    DROP COLUMN `supplier_id`,
    ADD COLUMN `clientCardID` VARCHAR(191) NOT NULL,
    ADD COLUMN `clientID` VARCHAR(191) NOT NULL,
    ADD COLUMN `meetingInfoID` VARCHAR(191) NOT NULL,
    ADD COLUMN `scheduleID` VARCHAR(191) NOT NULL,
    ADD COLUMN `supplierID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `clientcard` DROP COLUMN `card_id`,
    DROP COLUMN `client_id`,
    ADD COLUMN `cardID` VARCHAR(191) NOT NULL,
    ADD COLUMN `clientID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `clientcardlist` DROP COLUMN `product_id`,
    DROP COLUMN `product_price_id`,
    ADD COLUMN `productID` VARCHAR(191) NOT NULL,
    ADD COLUMN `productPriceID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `card_id`,
    DROP COLUMN `client_id`,
    ADD COLUMN `cardID` VARCHAR(191) NOT NULL,
    ADD COLUMN `clientID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `suppliermeetinginfo` DROP COLUMN `supplier_id`,
    ADD COLUMN `supplierID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `supplierschedule` DROP COLUMN `supplier_id`,
    ADD COLUMN `supplierID` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Agent_agentCardID_idx` ON `Agent`(`agentCardID`);

-- CreateIndex
CREATE INDEX `Booking_scheduleID_idx` ON `Booking`(`scheduleID`);

-- CreateIndex
CREATE INDEX `Booking_supplierID_idx` ON `Booking`(`supplierID`);

-- CreateIndex
CREATE INDEX `Booking_clientID_idx` ON `Booking`(`clientID`);

-- CreateIndex
CREATE INDEX `Booking_clientCardID_idx` ON `Booking`(`clientCardID`);

-- CreateIndex
CREATE INDEX `Booking_meetingInfoID_idx` ON `Booking`(`meetingInfoID`);

-- CreateIndex
CREATE INDEX `ClientCard_clientID_idx` ON `ClientCard`(`clientID`);

-- CreateIndex
CREATE INDEX `Order_clientID_idx` ON `Order`(`clientID`);

-- CreateIndex
CREATE INDEX `Order_cardID_idx` ON `Order`(`cardID`);

-- CreateIndex
CREATE INDEX `SupplierMeetingInfo_supplierID_idx` ON `SupplierMeetingInfo`(`supplierID`);

-- CreateIndex
CREATE INDEX `SupplierSchedule_supplierID_idx` ON `SupplierSchedule`(`supplierID`);
