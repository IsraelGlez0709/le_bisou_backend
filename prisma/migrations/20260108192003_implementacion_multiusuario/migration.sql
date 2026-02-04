/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId]` on the table `CatalogoPublico` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefono,usuarioId]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId]` on the table `Configuracion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku,usuarioId]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioId` to the `CatalogoPublico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Configuracion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Cliente_telefono_key` ON `cliente`;

-- DropIndex
DROP INDEX `Producto_sku_key` ON `producto`;

-- AlterTable
ALTER TABLE `catalogopublico` ADD COLUMN `usuarioId` INTEGER NOT NULL,
    MODIFY `tituloPestana` VARCHAR(191) NOT NULL DEFAULT 'Mi Catálogo',
    MODIFY `mensajeMantenimiento` VARCHAR(191) NOT NULL DEFAULT 'Estamos preparando la nueva colección... ✨';

-- AlterTable
ALTER TABLE `cliente` ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `configuracion` ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `producto` ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `venta` ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rol` ENUM('ADMIN', 'EMPRENDEDORA') NOT NULL DEFAULT 'EMPRENDEDORA',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `nombre` VARCHAR(191) NOT NULL,
    `fechaNacimiento` DATETIME(3) NULL,
    `ubicacion` VARCHAR(191) NULL,
    `ocupacion` VARCHAR(191) NULL,
    `fechaIngreso` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CatalogoPublico_usuarioId_key` ON `CatalogoPublico`(`usuarioId`);

-- CreateIndex
CREATE UNIQUE INDEX `Cliente_telefono_usuarioId_key` ON `Cliente`(`telefono`, `usuarioId`);

-- CreateIndex
CREATE UNIQUE INDEX `Configuracion_usuarioId_key` ON `Configuracion`(`usuarioId`);

-- CreateIndex
CREATE UNIQUE INDEX `Producto_sku_usuarioId_key` ON `Producto`(`sku`, `usuarioId`);

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Configuracion` ADD CONSTRAINT `Configuracion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatalogoPublico` ADD CONSTRAINT `CatalogoPublico_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
