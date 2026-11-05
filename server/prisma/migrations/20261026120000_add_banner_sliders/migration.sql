CREATE TABLE `banner_sliders` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(1000) NOT NULL DEFAULT '',
    `buttonText` VARCHAR(100) NOT NULL DEFAULT 'SHOP NOW',
    `link` VARCHAR(2048) NOT NULL DEFAULT '/shop',
    `image` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `banner_sliders_createdAt_idx` (`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
