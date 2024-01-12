-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `profile_url` TEXT NULL,
    `profile_key` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `origin` JSON NULL,
    `note` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCard` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `balance` INTEGER NOT NULL,
    `validity` VARCHAR(191) NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,
    `invoice` BOOLEAN NOT NULL,
    `repeat_purchases` BOOLEAN NOT NULL,
    `online_renews` BOOLEAN NOT NULL,
    `cardID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `ClientCard_clientID_idx`(`clientID`),
    INDEX `ClientCard_cardID_idx`(`cardID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCardList` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sold` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `balance` INTEGER NOT NULL,
    `validity` INTEGER NOT NULL,
    `available` BOOLEAN NOT NULL,
    `invoice` BOOLEAN NOT NULL,
    `repeat_purchases` BOOLEAN NOT NULL,
    `online_renews` BOOLEAN NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `productPriceID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `departmentID` VARCHAR(191) NOT NULL,

    INDEX `ClientCardList_departmentID_idx`(`departmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `profile_key` VARCHAR(191) NULL,
    `profile_url` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `card` JSON NULL,
    `tags` JSON NULL,
    `origin` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `employment_status` VARCHAR(191) NULL,
    `entry` DATETIME(3) NULL,
    `departure` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Supplier_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierBalance` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `payment_schedule` VARCHAR(191) NOT NULL,
    `payment_address` VARCHAR(191) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `booking_rate` DOUBLE NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SupplierBalance_supplierID_idx`(`supplierID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierBalanceTransactions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `payment_address` VARCHAR(191) NOT NULL,
    `paid_by` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `supplierBalanceID` VARCHAR(191) NOT NULL,

    INDEX `SupplierBalanceTransactions_supplierBalanceID_idx`(`supplierBalanceID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierEarnings` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `rate` DOUBLE NOT NULL,
    `amount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `supplierBalanceID` VARCHAR(191) NOT NULL,

    INDEX `SupplierEarnings_supplierBalanceID_idx`(`supplierBalanceID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierDeductions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `rate` DOUBLE NOT NULL,
    `amount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `supplierBalanceID` VARCHAR(191) NOT NULL,

    INDEX `SupplierDeductions_supplierBalanceID_idx`(`supplierBalanceID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierMeetingInfo` (
    `id` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `meeting_code` VARCHAR(191) NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SupplierMeetingInfo_supplierID_idx`(`supplierID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `clientUsername` VARCHAR(191) NULL,
    `clientID` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SupplierSchedule_supplierID_idx`(`supplierID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,
    `card_name` VARCHAR(191) NOT NULL,
    `clientCardID` VARCHAR(191) NOT NULL,
    `settlement` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `meeting_info` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `courseID` VARCHAR(191) NOT NULL,
    `departmentID` VARCHAR(191) NOT NULL,
    `scheduleID` VARCHAR(191) NOT NULL,

    INDEX `Booking_supplierID_idx`(`supplierID`),
    INDEX `Booking_clientID_idx`(`clientID`),
    INDEX `Booking_courseID_idx`(`courseID`),
    INDEX `Booking_departmentID_idx`(`departmentID`),
    INDEX `Booking_scheduleID_idx`(`scheduleID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierPrice` (
    `id` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `cardID` VARCHAR(191) NOT NULL,

    INDEX `SupplierPrice_supplierID_idx`(`supplierID`),
    INDEX `SupplierPrice_cardID_idx`(`cardID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Courses` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reminders` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `supplierID` VARCHAR(191) NULL,
    `clientID` VARCHAR(191) NULL,
    `departmentID` VARCHAR(191) NULL,
    `card_name` VARCHAR(191) NULL,
    `settlement` VARCHAR(191) NULL,
    `clientCardID` VARCHAR(191) NULL,
    `courseID` VARCHAR(191) NULL,
    `scheduleID` VARCHAR(191) NULL,
    `price` INTEGER NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `meeting_info` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Reminders_departmentID_idx`(`departmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agent` (
    `id` VARCHAR(191) NOT NULL,
    `profile_url` VARCHAR(191) NULL,
    `profile_key` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `organization` JSON NULL,
    `payment_information` JSON NULL,
    `phone_number` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `origin` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `agentCardID` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Agent_username_key`(`username`),
    INDEX `Agent_agentCardID_idx`(`agentCardID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentCard` (
    `id` VARCHAR(191) NOT NULL,
    `type` JSON NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `invoice_number` VARCHAR(191) NULL,
    `express_number` VARCHAR(191) NULL,
    `cardID` VARCHAR(191) NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `departmentID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Order_id_key`(`id`),
    INDEX `Order_clientID_idx`(`clientID`),
    INDEX `Order_cardID_idx`(`cardID`),
    INDEX `Order_departmentID_idx`(`departmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuperAdmin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SuperAdmin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Department_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `keywords` JSON NULL,
    `content` TEXT NOT NULL,
    `department_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `News_department_id_idx`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClientToDepartment` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ClientToDepartment_AB_unique`(`A`, `B`),
    INDEX `_ClientToDepartment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClientCardListToCourses` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ClientCardListToCourses_AB_unique`(`A`, `B`),
    INDEX `_ClientCardListToCourses_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AgentToDepartment` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AgentToDepartment_AB_unique`(`A`, `B`),
    INDEX `_AgentToDepartment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AdminToDepartment` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AdminToDepartment_AB_unique`(`A`, `B`),
    INDEX `_AdminToDepartment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DepartmentToSupplier` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DepartmentToSupplier_AB_unique`(`A`, `B`),
    INDEX `_DepartmentToSupplier_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;