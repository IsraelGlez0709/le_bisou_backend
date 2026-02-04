import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET (Privado): Obtener mi configuración de catálogo para editarla
export const getMyCatalogConfig = async (req, res) => {
    try {
        let catalogo = await prisma.catalogoPublico.findUnique({
            where: { usuarioId: req.usuario.id },
        });

        if (!catalogo) {
            catalogo = await prisma.catalogoPublico.create({
                data: { usuarioId: req.usuario.id, layout: [] },
            });
        }
        res.json(catalogo);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo catálogo" });
    }
};

// PUT (Privado): Publicar cambios
export const publishCatalog = async (req, res) => {
    try {
        const { layout, activo, mensajeMantenimiento } = req.body;

        const actualizado = await prisma.catalogoPublico.upsert({
            where: { usuarioId: req.usuario.id },
            update: {
                layout: layout !== undefined ? layout : undefined,
                activo: activo !== undefined ? activo : undefined,
                mensajeMantenimiento,
                ultimaActualizacion: new Date(),
            },
            create: {
                usuarioId: req.usuario.id,
                layout: layout || [],
                activo: true,
                mensajeMantenimiento,
            },
        });

        if (req.io) {
            req.io.emit(
                `server:catalogo_actualizado_${req.usuario.id}`,
                actualizado
            );
        }

        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: "Error publicando catálogo" });
    }
};

// GET (PÚBLICO): Ver el catálogo de una emprendedora específica
// URL ejemplo: /api/catalogo/publico/:usuarioId
export const getPublicCatalogByUserId = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const catalogo = await prisma.catalogoPublico.findUnique({
            where: { usuarioId: parseInt(usuarioId) },
            include: {
                usuario: { select: { nombre: true, email: true, ubicacion: true } },
            },
        });

        if (!catalogo || !catalogo.activo) {
            return res.status(404).json({ error: "Catálogo no disponible" });
        }
        res.json(catalogo);
    } catch (error) {
        res.status(500).json({ error: "Error buscando catálogo" });
    }
};
