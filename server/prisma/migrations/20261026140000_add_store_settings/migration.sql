CREATE TABLE `store_settings` (
    `id` VARCHAR(32) NOT NULL DEFAULT 'singleton',
    `general` JSON NOT NULL,
    `seo` JSON NOT NULL,
    `branding` JSON NOT NULL,
    `telegramChatId` VARCHAR(191) NULL,
    `telegramBotTokenEncrypted` TEXT NULL,
    `notifyOnNewOrder` BOOLEAN NOT NULL DEFAULT true,
    `delivery` JSON NOT NULL,
    `payment` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
