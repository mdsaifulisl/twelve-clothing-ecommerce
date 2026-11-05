CREATE TABLE `terms_pages` (
    `id` VARCHAR(32) NOT NULL DEFAULT 'singleton',
    `title` VARCHAR(191) NOT NULL,
    `introduction` TEXT NOT NULL,
    `effectiveDate` VARCHAR(10) NOT NULL,
    `sections` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
