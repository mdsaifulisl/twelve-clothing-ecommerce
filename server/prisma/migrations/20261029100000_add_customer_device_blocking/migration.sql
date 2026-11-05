ALTER TABLE `security_audit_logs`
    MODIFY `targetType` ENUM('CUSTOMER', 'IP', 'DEVICE') NOT NULL,
    MODIFY `action` ENUM('CUSTOMER_CREATED', 'CUSTOMER_BLOCKED', 'CUSTOMER_UNBLOCKED', 'IP_BLOCKED', 'IP_UNBLOCKED', 'DEVICE_BLOCKED', 'DEVICE_UNBLOCKED') NOT NULL;

CREATE TABLE `customer_devices` (
    `id` VARCHAR(191) NOT NULL,
    `fingerprintHash` CHAR(64) NOT NULL,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `blockReason` TEXT NULL,
    `blockedAt` DATETIME(3) NULL,
    `blockedBy` VARCHAR(191) NULL,
    `unblockedAt` DATETIME(3) NULL,
    `unblockedBy` VARCHAR(191) NULL,
    `firstSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customer_devices_fingerprintHash_key` (`fingerprintHash`),
    INDEX `customer_devices_isBlocked_lastSeenAt_idx` (`isBlocked`, `lastSeenAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `orders`
    ADD COLUMN `deviceFingerprint` CHAR(64) NULL,
    ADD INDEX `orders_deviceFingerprint_createdAt_idx` (`deviceFingerprint`, `createdAt`);
