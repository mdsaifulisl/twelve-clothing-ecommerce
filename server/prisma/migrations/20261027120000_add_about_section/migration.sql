CREATE TABLE `about_sections` (
    `id` VARCHAR(32) NOT NULL DEFAULT 'singleton',
    `title` VARCHAR(191) NOT NULL,
    `paragraph1` TEXT NOT NULL,
    `paragraph2` TEXT NOT NULL,
    `buttonText` VARCHAR(100) NOT NULL,
    `buttonLink` VARCHAR(2048) NOT NULL,
    `imageUrl` VARCHAR(2048) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
