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
    `origin` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `agentID` VARCHAR(191) NULL,

    UNIQUE INDEX `Client_username_key`(`username`),
    INDEX `Client_agentID_idx`(`agentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCard` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `balance` INTEGER NOT NULL,
    `validity` VARCHAR(191) NOT NULL,
    `invoice` BOOLEAN NOT NULL,
    `repeat_purchases` BOOLEAN NOT NULL,
    `online_renews` BOOLEAN NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,
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
    `price` DECIMAL(65, 30) NOT NULL,
    `balance` INTEGER NOT NULL,
    `validity` INTEGER NOT NULL,
    `available` BOOLEAN NOT NULL,
    `invoice` BOOLEAN NOT NULL,
    `repeat_purchases` BOOLEAN NOT NULL,
    `online_renews` BOOLEAN NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `productPriceID` VARCHAR(191) NOT NULL,
    `prepaid` BOOLEAN NOT NULL DEFAULT true,
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
    `tags` JSON NULL,
    `origin` VARCHAR(191) NULL,
    `note` TEXT NULL,
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
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `payment_address` VARCHAR(191) NOT NULL,
    `salary` INTEGER NULL,
    `booking_rate` INTEGER NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SupplierBalance_supplierID_idx`(`supplierID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierBalanceTransactions` (
    `id` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
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
    `quantity` INTEGER NOT NULL,
    `rate` DECIMAL(65, 30) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
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
    `quantity` INTEGER NOT NULL,
    `rate` DECIMAL(65, 30) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
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
CREATE TABLE `SupplierPrice` (
    `id` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `cardID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

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
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `supplier_rate` DECIMAL(65, 30) NOT NULL,
    `card_balance_cost` INTEGER NOT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,
    `card_name` VARCHAR(191) NOT NULL,
    `clientCardID` VARCHAR(191) NOT NULL,
    `settlement` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `client_quantity` DECIMAL(65, 30) NOT NULL,
    `supplier_quantity` DECIMAL(65, 30) NOT NULL,
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
CREATE TABLE `BookingRequest` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `clientCardID` VARCHAR(191) NOT NULL,
    `meetingInfoID` VARCHAR(191) NOT NULL,
    `card_balance_cost` INTEGER NOT NULL,
    `card_name` VARCHAR(191) NOT NULL,
    `courseID` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `settlement` VARCHAR(191) NOT NULL,
    `client_quantity` DECIMAL(65, 30) NOT NULL,
    `supplier_quantity` DECIMAL(65, 30) NOT NULL,
    `note` TEXT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `departmentID` VARCHAR(191) NOT NULL,

    INDEX `BookingRequest_supplierID_idx`(`supplierID`),
    INDEX `BookingRequest_clientID_idx`(`clientID`),
    INDEX `BookingRequest_departmentID_idx`(`departmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reminders` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `supplierID` VARCHAR(191) NULL,
    `clientID` VARCHAR(191) NULL,
    `departmentID` VARCHAR(191) NULL,
    `card_name` VARCHAR(191) NULL,
    `settlement` VARCHAR(191) NULL,
    `clientCardID` VARCHAR(191) NULL,
    `courseID` VARCHAR(191) NULL,
    `scheduleID` VARCHAR(191) NULL,
    `price` INTEGER NULL,
    `client_quantity` DECIMAL(65, 30) NOT NULL,
    `supplier_quantity` DECIMAL(65, 30) NOT NULL,
    `meeting_info` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Reminders_departmentID_idx`(`departmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientBookingComments` (
    `id` VARCHAR(191) NOT NULL,
    `rate` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `bookingID` VARCHAR(191) NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,

    INDEX `ClientBookingComments_bookingID_idx`(`bookingID`),
    INDEX `ClientBookingComments_clientID_idx`(`clientID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierBookingComments` (
    `id` VARCHAR(191) NOT NULL,
    `rate` INTEGER NOT NULL,
    `client_level` VARCHAR(191) NOT NULL,
    `book_name` VARCHAR(191) NOT NULL,
    `book_page` VARCHAR(191) NOT NULL,
    `vocabulary` JSON NOT NULL,
    `sentences` TEXT NOT NULL,
    `message` TEXT NOT NULL,
    `homework` TEXT NULL,
    `supplierID` VARCHAR(191) NOT NULL,
    `bookingID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SupplierBookingComments_supplierID_idx`(`supplierID`),
    INDEX `SupplierBookingComments_bookingID_idx`(`bookingID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingCommentTemplates` (
    `id` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `user` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agent` (
    `id` VARCHAR(191) NOT NULL,
    `profile_url` VARCHAR(191) NULL,
    `profile_key` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `origin` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Agent_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentBalance` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `payment_address` VARCHAR(191) NOT NULL,
    `commission_rate` INTEGER NOT NULL,
    `commission_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `agentID` VARCHAR(191) NOT NULL,

    INDEX `AgentBalance_agentID_idx`(`agentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentEarnings` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `rate` DECIMAL(65, 30) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `agentBalanceID` VARCHAR(191) NOT NULL,

    INDEX `AgentEarnings_agentBalanceID_idx`(`agentBalanceID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentDeductions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `rate` DECIMAL(65, 30) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `agentBalanceID` VARCHAR(191) NOT NULL,

    INDEX `AgentDeductions_agentBalanceID_idx`(`agentBalanceID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentBalanceTransactions` (
    `id` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `payment_address` VARCHAR(191) NOT NULL,
    `paid_by` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `agentBalanceID` VARCHAR(191) NOT NULL,

    INDEX `AgentBalanceTransactions_agentBalanceID_idx`(`agentBalanceID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `invoice_number` VARCHAR(191) NULL,
    `express_number` VARCHAR(191) NULL,
    `cardID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `clientID` VARCHAR(191) NOT NULL,
    `departmentID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Order_id_key`(`id`),
    INDEX `Order_clientID_idx`(`clientID`),
    INDEX `Order_departmentID_idx`(`departmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `gender` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `profile_key` VARCHAR(191) NULL,
    `profile_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DepartmentPermission` (
    `id` VARCHAR(191) NOT NULL,
    `adminID` VARCHAR(191) NOT NULL,
    `departmentID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `DepartmentPermission_adminID_idx`(`adminID`),
    INDEX `DepartmentPermission_departmentID_idx`(`departmentID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminPermission` (
    `id` VARCHAR(191) NOT NULL,
    `view_client` BOOLEAN NOT NULL DEFAULT false,
    `create_client` BOOLEAN NOT NULL DEFAULT false,
    `update_client` BOOLEAN NOT NULL DEFAULT false,
    `delete_client` BOOLEAN NOT NULL DEFAULT false,
    `view_client_cards` BOOLEAN NOT NULL DEFAULT false,
    `update_client_cards` BOOLEAN NOT NULL DEFAULT false,
    `delete_client_cards` BOOLEAN NOT NULL DEFAULT false,
    `view_cards` BOOLEAN NOT NULL DEFAULT false,
    `create_cards` BOOLEAN NOT NULL DEFAULT false,
    `update_cards` BOOLEAN NOT NULL DEFAULT false,
    `delete_cards` BOOLEAN NOT NULL DEFAULT false,
    `bind_cards` BOOLEAN NOT NULL DEFAULT false,
    `renew_cards` BOOLEAN NOT NULL DEFAULT false,
    `view_supplier` BOOLEAN NOT NULL DEFAULT false,
    `create_supplier` BOOLEAN NOT NULL DEFAULT false,
    `update_supplier` BOOLEAN NOT NULL DEFAULT false,
    `delete_supplier` BOOLEAN NOT NULL DEFAULT false,
    `send_supplier_payslip` BOOLEAN NOT NULL DEFAULT false,
    `view_supplier_payment_request` BOOLEAN NOT NULL DEFAULT false,
    `update_supplier_payment_request` BOOLEAN NOT NULL DEFAULT false,
    `receive_cancel_request_email` BOOLEAN NOT NULL DEFAULT false,
    `create_supplier_earnings` BOOLEAN NOT NULL DEFAULT false,
    `delete_supplier_earnings` BOOLEAN NOT NULL DEFAULT false,
    `view_supplier_earnings` BOOLEAN NOT NULL DEFAULT false,
    `create_supplier_deductions` BOOLEAN NOT NULL DEFAULT false,
    `delete_supplier_deductions` BOOLEAN NOT NULL DEFAULT false,
    `view_supplier_deductions` BOOLEAN NOT NULL DEFAULT false,
    `view_supplier_schedule` BOOLEAN NOT NULL DEFAULT false,
    `create_supplier_schedule` BOOLEAN NOT NULL DEFAULT false,
    `delete_supplier_schedule` BOOLEAN NOT NULL DEFAULT false,
    `view_courses` BOOLEAN NOT NULL DEFAULT false,
    `create_courses` BOOLEAN NOT NULL DEFAULT false,
    `update_courses` BOOLEAN NOT NULL DEFAULT false,
    `delete_courses` BOOLEAN NOT NULL DEFAULT false,
    `view_orders` BOOLEAN NOT NULL DEFAULT false,
    `create_orders` BOOLEAN NOT NULL DEFAULT false,
    `update_orders` BOOLEAN NOT NULL DEFAULT false,
    `delete_orders` BOOLEAN NOT NULL DEFAULT false,
    `view_agent` BOOLEAN NOT NULL DEFAULT false,
    `create_agent` BOOLEAN NOT NULL DEFAULT false,
    `update_agent` BOOLEAN NOT NULL DEFAULT false,
    `delete_agent` BOOLEAN NOT NULL DEFAULT false,
    `send_agent_payslip` BOOLEAN NOT NULL DEFAULT false,
    `view_agent_payment_request` BOOLEAN NOT NULL DEFAULT false,
    `update_agent_payment_request` BOOLEAN NOT NULL DEFAULT false,
    `create_agent_earnings` BOOLEAN NOT NULL DEFAULT false,
    `delete_agent_earnings` BOOLEAN NOT NULL DEFAULT false,
    `view_agent_earnings` BOOLEAN NOT NULL DEFAULT false,
    `create_agent_deductions` BOOLEAN NOT NULL DEFAULT false,
    `delete_agent_deductions` BOOLEAN NOT NULL DEFAULT false,
    `view_agent_deductions` BOOLEAN NOT NULL DEFAULT false,
    `view_news` BOOLEAN NOT NULL DEFAULT false,
    `create_news` BOOLEAN NOT NULL DEFAULT false,
    `update_news` BOOLEAN NOT NULL DEFAULT false,
    `delete_news` BOOLEAN NOT NULL DEFAULT false,
    `view_booking` BOOLEAN NOT NULL DEFAULT false,
    `create_booking` BOOLEAN NOT NULL DEFAULT false,
    `update_booking` BOOLEAN NOT NULL DEFAULT false,
    `delete_booking` BOOLEAN NOT NULL DEFAULT false,
    `cancel_booking` BOOLEAN NOT NULL DEFAULT false,
    `view_booking_request` BOOLEAN NOT NULL DEFAULT false,
    `create_booking_request` BOOLEAN NOT NULL DEFAULT false,
    `cancel_booking_request` BOOLEAN NOT NULL DEFAULT false,
    `delete_booking_request` BOOLEAN NOT NULL DEFAULT false,
    `view_booking_comments` BOOLEAN NOT NULL DEFAULT false,
    `delete_booking_comments` BOOLEAN NOT NULL DEFAULT false,
    `view_booking_comments_template` BOOLEAN NOT NULL DEFAULT false,
    `create_booking_comments_template` BOOLEAN NOT NULL DEFAULT false,
    `update_booking_comments_template` BOOLEAN NOT NULL DEFAULT false,
    `delete_booking_comments_template` BOOLEAN NOT NULL DEFAULT false,
    `view_reminders` BOOLEAN NOT NULL DEFAULT false,
    `create_reminders` BOOLEAN NOT NULL DEFAULT false,
    `update_reminders` BOOLEAN NOT NULL DEFAULT false,
    `delete_reminders` BOOLEAN NOT NULL DEFAULT false,
    `confirm_reminders` BOOLEAN NOT NULL DEFAULT false,
    `download_table` BOOLEAN NOT NULL DEFAULT false,
    `handle_settings` BOOLEAN NOT NULL DEFAULT false,
    `view_statistics` BOOLEAN NOT NULL DEFAULT false,
    `departmentPermissionID` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `AdminPermission_departmentPermissionID_idx`(`departmentPermissionID`),
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
