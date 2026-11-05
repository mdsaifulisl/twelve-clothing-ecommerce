-- Additive customer and IP management schema. Existing rows are retained.

CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(32) NOT NULL,
    `normalizedPhone` VARCHAR(20) NOT NULL,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `blockReason` TEXT NULL,
    `blockedAt` DATETIME(3) NULL,
    `blockedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_normalizedPhone_key` (`normalizedPhone`),
    INDEX `customers_isBlocked_createdAt_idx` (`isBlocked`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `blocked_ips` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(45) NOT NULL,
    `family` ENUM('IPV4', 'IPV6') NOT NULL,
    `isBlocked` BOOLEAN NOT NULL DEFAULT true,
    `reason` TEXT NULL,
    `blockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `blockedBy` VARCHAR(191) NULL,
    `unblockedAt` DATETIME(3) NULL,
    `unblockedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blocked_ips_address_key` (`address`),
    INDEX `blocked_ips_isBlocked_blockedAt_idx` (`isBlocked`, `blockedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `security_audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `targetType` ENUM('CUSTOMER', 'IP') NOT NULL,
    `targetId` VARCHAR(191) NOT NULL,
    `action` ENUM('CUSTOMER_CREATED', 'CUSTOMER_BLOCKED', 'CUSTOMER_UNBLOCKED', 'IP_BLOCKED', 'IP_UNBLOCKED') NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `actorLabel` VARCHAR(191) NULL,
    `oldValue` JSON NULL,
    `newValue` JSON NULL,
    `requestIp` VARCHAR(45) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `security_audit_logs_targetType_targetId_createdAt_idx` (`targetType`, `targetId`, `createdAt`),
    INDEX `security_audit_logs_action_createdAt_idx` (`action`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `orders`
    ADD COLUMN `customerId` VARCHAR(191) NULL,
    ADD INDEX `orders_customerId_createdAt_idx` (`customerId`, `createdAt`),
    ADD CONSTRAINT `orders_customerId_fkey`
        FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`)
        ON DELETE RESTRICT ON UPDATE CASCADE;
