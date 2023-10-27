-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `profile` TEXT NULL,
    `name` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `Client_user_name_key`(`user_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCard` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `balance` INTEGER NOT NULL,
    `validity` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `invoice` BOOLEAN NOT NULL,
    `repeat_purchases` BOOLEAN NOT NULL,
    `online_purchases` BOOLEAN NOT NULL,
    `online_renews` BOOLEAN NOT NULL,
    `settlement_period` VARCHAR(191) NOT NULL,
    `card_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `ClientCard_client_id_idx`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCardList` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `balance` INTEGER NOT NULL,
    `validity` INTEGER NOT NULL,
    `invoice` BOOLEAN NOT NULL,
    `repeat_purchases` BOOLEAN NOT NULL,
    `online_purchases` BOOLEAN NOT NULL,
    `online_renews` BOOLEAN NOT NULL,
    `settlement_period` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `product_price_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `profile` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NULL,
    `payment_info` VARCHAR(191) NULL,
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

    UNIQUE INDEX `Supplier_user_name_key`(`user_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierMeetingInfo` (
    `id` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `meeting_code` VARCHAR(191) NOT NULL,
    `supplier_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SupplierMeetingInfo_supplier_id_idx`(`supplier_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `supplier_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `reserved` BOOLEAN NOT NULL DEFAULT false,
    `canceled` BOOLEAN NOT NULL DEFAULT false,
    `meeting_info` JSON NULL,
    `note` VARCHAR(191) NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SupplierSchedule_supplier_id_idx`(`supplier_id`),
    INDEX `SupplierSchedule_client_id_idx`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agent` (
    `id` VARCHAR(191) NOT NULL,
    `profile` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `organization` JSON NULL,
    `payment_information` JSON NULL,
    `phone_number` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `origin` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `agent_card_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Agent_user_name_key`(`user_name`),
    INDEX `Agent_agent_card_id_idx`(`agent_card_id`),
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
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `invoice_number` VARCHAR(191) NULL,
    `express_number` VARCHAR(191) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `schedule_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_id_key`(`id`),
    INDEX `Order_schedule_id_idx`(`schedule_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_user_name_key`(`user_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuperAdmin` (
    `id` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SuperAdmin_user_name_key`(`user_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

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

-- CreateTable
CREATE TABLE `_DepartmentToOrder` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DepartmentToOrder_AB_unique`(`A`, `B`),
    INDEX `_DepartmentToOrder_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
