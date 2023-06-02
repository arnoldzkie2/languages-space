/*
  Warnings:

  - A unique constraint covering the columns `[user_name]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `AgentCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `PostpaidCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `PrepaidCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `SuperAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `SupplierCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `SupplierCardType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Admin_user_name_key` ON `Admin`(`user_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Agent_id_key` ON `Agent`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Agent_user_name_key` ON `Agent`(`user_name`);

-- CreateIndex
CREATE UNIQUE INDEX `AgentCard_id_key` ON `AgentCard`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Client_id_key` ON `Client`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Client_user_name_key` ON `Client`(`user_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Department_id_key` ON `Department`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_id_key` ON `Order`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `PostpaidCard_id_key` ON `PostpaidCard`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `PrepaidCard_id_key` ON `PrepaidCard`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `SuperAdmin_user_name_key` ON `SuperAdmin`(`user_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_id_key` ON `Supplier`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_user_name_key` ON `Supplier`(`user_name`);

-- CreateIndex
CREATE UNIQUE INDEX `SupplierCard_id_key` ON `SupplierCard`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `SupplierCardType_id_key` ON `SupplierCardType`(`id`);
