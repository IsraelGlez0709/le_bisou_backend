-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `insumoBase` DOUBLE NOT NULL,
    `tipoCaja` VARCHAR(191) NOT NULL DEFAULT 'ninguna',
    `usaImpresion` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Producto_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Configuracion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `precioBolsa` DOUBLE NOT NULL DEFAULT 12.0,
    `precioCajaChica` DOUBLE NOT NULL DEFAULT 12.0,
    `precioCajaGrande` DOUBLE NOT NULL DEFAULT 45.0,
    `precioImpresion` DOUBLE NOT NULL DEFAULT 6.50,
    `precioTiempo` DOUBLE NOT NULL DEFAULT 7.00,
    `margenPublico` DOUBLE NOT NULL DEFAULT 1.60,
    `margenEmprendedora` DOUBLE NOT NULL DEFAULT 1.35,
    `margenDistribuidora` DOUBLE NOT NULL DEFAULT 1.45,
    `nombreMarca` VARCHAR(191) NOT NULL DEFAULT 'Le Bisou Joyería',
    `colorMarca` VARCHAR(191) NOT NULL DEFAULT '#db2777',
    `mensajePiePagina` VARCHAR(191) NOT NULL DEFAULT 'Precios sujetos a cambio sin previo aviso.',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
