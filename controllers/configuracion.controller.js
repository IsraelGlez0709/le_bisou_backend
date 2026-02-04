import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET: Obtener config (o crear default si no existe)
export const getConfig = async (req, res) => {
    try {
        let config = await prisma.configuracion.findUnique({
            where: { usuarioId: req.usuario.id },
        });

        if (!config) {
            const usuario = await prisma.usuario.findUnique({
                where: { id: req.usuario.id },
            });
            // Crear configuración por defecto
            config = await prisma.configuracion.create({
                data: {
                    usuarioId: req.usuario.id,
                    nombreMarca: `Le Bisou - ${usuario.nombre}`,
                    precioBolsa: 12.0,
                    precioImpresion: 6.5,
                    precioCajaChica: 12.0,
                    precioCajaGrande: 45.0,
                    precioTiempo: 7.0,
                    margenPublico: 1.6,
                    margenEmprendedora: 1.35,
                    margenDistribuidora: 1.45,
                },
            });
        }

        // TRUCO DE COMPATIBILIDAD:
        // Devolvemos tanto los nombres reales (precioBolsa) como los cortos (bolsa)
        // para que tu Frontend (Context) no se rompa al leerlos.
        const configFrontend = {
            ...config,
            bolsa: config.precioBolsa,
            impresion: config.precioImpresion,
            cajaChica: config.precioCajaChica,
            cajaGrande: config.precioCajaGrande,
            tiempo: config.precioTiempo,
        };

        res.json(configFrontend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo configuración" });
    }
};

// PUT: Guardar cambios (CORREGIDO)
export const updateConfig = async (req, res) => {
    try {
        const datos = req.body;

        // 1. MAPEO MANUAL (Sanitización)
        // Aquí arreglamos el error: Tomamos el valor de 'bolsa' (si viene)
        // y lo metemos en 'precioBolsa' (que es lo que pide la BD).
        const datosLimpios = {
            // Costos (Si viene 'bolsa', úsalo; si no, busca 'precioBolsa'; si no, 0)
            precioBolsa: parseFloat(datos.bolsa ?? datos.precioBolsa ?? 0),
            precioImpresion: parseFloat(
                datos.impresion ?? datos.precioImpresion ?? 0
            ),
            precioCajaChica: parseFloat(
                datos.cajaChica ?? datos.precioCajaChica ?? 0
            ),
            precioCajaGrande: parseFloat(
                datos.cajaGrande ?? datos.precioCajaGrande ?? 0
            ),
            precioTiempo: parseFloat(datos.tiempo ?? datos.precioTiempo ?? 0),

            // Márgenes
            margenPublico: parseFloat(datos.margenPublico ?? 1.6),
            margenEmprendedora: parseFloat(datos.margenEmprendedora ?? 1.35),
            margenDistribuidora: parseFloat(datos.margenDistribuidora ?? 1.45),

            // Textos
            nombreMarca: datos.nombreMarca,
            colorMarca: datos.colorMarca,
            mensajePiePagina: datos.mensajePiePagina,
        };

        // 2. Ejecutar Update en Prisma solo con los campos válidos
        const config = await prisma.configuracion.upsert({
            where: { usuarioId: req.usuario.id },
            update: datosLimpios, // <--- Aquí ya solo van campos que existen en la BD
            create: {
                usuarioId: req.usuario.id,
                ...datosLimpios,
            },
        });

        // Devolvemos la respuesta
        res.json(config);
    } catch (error) {
        console.error("Error updateConfig:", error);
        // Devolvemos el mensaje de error exacto para debugging, pero status 400
        res.status(400).json({
            error: "Error al guardar: Revisa los datos enviados.",
        });
    }
};
