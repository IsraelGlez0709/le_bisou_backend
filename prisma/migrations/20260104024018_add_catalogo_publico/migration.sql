-- CreateTable
CREATE TABLE `CatalogoPublico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `tituloPestana` VARCHAR(191) NOT NULL DEFAULT 'Catálogo Le Bisou',
    `mensajeMantenimiento` VARCHAR(191) NOT NULL DEFAULT 'Estamos preparando la nueva colección... Vuelve pronto ✨',
    `layout` JSON NULL,
    `ultimaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
