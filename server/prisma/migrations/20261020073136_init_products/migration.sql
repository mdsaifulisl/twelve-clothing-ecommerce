/*
  Warnings:

  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `images` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availableSizes` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `careInstructions` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `products` table without a default value. This is not possible if the table is not empty.
  - Made the column `subCategory` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `products` DROP PRIMARY KEY,
    DROP COLUMN `images`,
    DROP COLUMN `name`,
    DROP COLUMN `stock`,
    ADD COLUMN `availableSizes` JSON NOT NULL,
    ADD COLUMN `careInstructions` JSON NOT NULL,
    ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `discount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `fit` VARCHAR(191) NULL,
    ADD COLUMN `image` JSON NOT NULL,
    ADD COLUMN `material` VARCHAR(191) NULL,
    ADD COLUMN `productType` VARCHAR(191) NOT NULL,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `subCategory` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `products_sku_key` ON `products`(`sku`);
