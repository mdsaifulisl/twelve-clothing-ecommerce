CREATE TABLE `store_locations` (
    `id` VARCHAR(191) NOT NULL,
    `division` VARCHAR(100) NOT NULL DEFAULT 'Dhaka Division',
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `phone` VARCHAR(32) NOT NULL,
    `offDay` VARCHAR(50) NOT NULL DEFAULT 'Sunday',
    `openingTime` VARCHAR(50) NOT NULL DEFAULT '10:00 AM',
    `closingTime` VARCHAR(50) NOT NULL DEFAULT '10:00 PM',
    `mapLink` VARCHAR(2048) NOT NULL DEFAULT '#',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `store_locations_division_name_idx` (`division`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
