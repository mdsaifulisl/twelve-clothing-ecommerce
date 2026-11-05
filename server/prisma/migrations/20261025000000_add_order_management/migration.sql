-- Additive order-management schema. This migration does not alter or delete existing data.

CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `orderCode` VARCHAR(32) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(32) NOT NULL,
    `normalizedPhone` VARCHAR(20) NOT NULL,
    `address` TEXT NOT NULL,
    `city` ENUM('dhaka', 'outside') NOT NULL,
    `paymentMethod` ENUM('cod', 'online') NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `deliveryCharge` DECIMAL(12, 2) NOT NULL,
    `totalAmount` DECIMAL(12, 2) NOT NULL,
    `clientIp` VARCHAR(45) NULL,
    `seenAt` DATETIME(3) NULL,
    `seenBy` VARCHAR(191) NULL,
    `archivedAt` DATETIME(3) NULL,
    `archivedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_orderCode_key` (`orderCode`),
    INDEX `orders_status_createdAt_idx` (`status`, `createdAt`),
    INDEX `orders_archivedAt_createdAt_idx` (`archivedAt`, `createdAt`),
    INDEX `orders_normalizedPhone_idx` (`normalizedPhone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `productTitle` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `size` VARCHAR(32) NOT NULL,
    `color` VARCHAR(191) NULL,
    `unitPrice` DECIMAL(12, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `lineTotal` DECIMAL(12, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_items_orderId_idx` (`orderId`),
    INDEX `order_items_productId_idx` (`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `order_audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `action` ENUM('ORDER_CREATED', 'STATUS_CHANGED', 'ARCHIVED', 'UNARCHIVED', 'SEEN') NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `actorLabel` VARCHAR(191) NULL,
    `oldValue` JSON NULL,
    `newValue` JSON NULL,
    `requestIp` VARCHAR(45) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_audit_logs_orderId_createdAt_idx` (`orderId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `order_items`
    ADD CONSTRAINT `order_items_orderId_fkey`
    FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `order_items`
    ADD CONSTRAINT `order_items_productId_fkey`
    FOREIGN KEY (`productId`) REFERENCES `products`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `order_audit_logs`
    ADD CONSTRAINT `order_audit_logs_orderId_fkey`
    FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
