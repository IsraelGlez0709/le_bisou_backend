import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// GET: Obtener productos del usuario
export const getProductos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({
            where: {
                usuarioId: req.usuario.id, // FILTRO DE SEGURIDAD
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

// POST: Crear producto
export const createProducto = async (req, res) => {
    try {
        const datos = req.body;
        const usaImpresionCorrecto = String(datos.usaImpresion) === "true";

        const nuevoProducto = await prisma.producto.create({
            data: {
                usuarioId: req.usuario.id, // ASIGNACIÓN DE DUEÑO
                nombre: datos.nombre,
                sku: datos.sku,
                categoria: datos.categoria,
                stock: parseInt(datos.stock) || 0,
                insumoBase: parseFloat(datos.insumoBase) || 0,
                tipoCaja: datos.tipoCaja,
                usaImpresion: usaImpresionCorrecto,
                imagen: req.file ? req.file.filename : null,
                descripcion: datos.descripcion || "",
                activo: true,
            },
        });

        res.json(nuevoProducto);
    } catch (error) {
        console.error(error);
        if (error.code === "P2002") {
            return res
                .status(400)
                .json({ error: "Ya tienes un producto con este SKU" });
        }
        res.status(400).json({ error: "No se pudo crear el producto" });
    }
};

// PUT: Actualizar producto (COMPLETO)
export const updateProducto = async (req, res) => {
    const { id } = req.params;
    const datos = req.body;

    try {
        // 1. Verificar que el producto pertenezca al usuario
        const productoExiste = await prisma.producto.findFirst({
            where: {
                id: parseInt(id),
                usuarioId: req.usuario.id,
            },
        });

        if (!productoExiste) {
            return res
                .status(404)
                .json({ error: "Producto no encontrado o no tienes permiso" });
        }

        // 2. Preparar datos
        const datosActualizar = {};
        if (datos.nombre) datosActualizar.nombre = datos.nombre;
        if (datos.sku) datosActualizar.sku = datos.sku;
        if (datos.categoria) datosActualizar.categoria = datos.categoria;
        if (datos.tipoCaja) datosActualizar.tipoCaja = datos.tipoCaja;
        if (datos.descripcion !== undefined)
            datosActualizar.descripcion = datos.descripcion;

        if (
            datos.stock !== undefined &&
            datos.stock !== null &&
            datos.stock !== ""
        ) {
            const stockNum = parseInt(datos.stock);
            if (!isNaN(stockNum)) datosActualizar.stock = stockNum;
        }

        if (
            datos.insumoBase !== undefined &&
            datos.insumoBase !== null &&
            datos.insumoBase !== ""
        ) {
            const insumoNum = parseFloat(datos.insumoBase);
            if (!isNaN(insumoNum)) datosActualizar.insumoBase = insumoNum;
        }

        if (datos.usaImpresion !== undefined) {
            datosActualizar.usaImpresion = String(datos.usaImpresion) === "true";
        }

        if (datos.activo !== undefined) {
            datosActualizar.activo = String(datos.activo) === "true";
        }

        if (req.file) {
            datosActualizar.imagen = req.file.filename;
            // Opcional: Borrar imagen anterior del servidor si existe
            // if (productoExiste.imagen) { fs.unlink... }
        }

        // 3. Actualizar
        const productoActualizado = await prisma.producto.update({
            where: { id: parseInt(id) },
            data: datosActualizar,
        });

        res.json(productoActualizado);
    } catch (error) {
        console.error(error);
        if (error.code === "P2002") {
            return res
                .status(400)
                .json({ error: "El SKU ya está en uso en otro de tus productos" });
        }
        res.status(400).json({ error: "No se pudo actualizar" });
    }
};

// DELETE: Eliminar producto
export const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const count = await prisma.producto.deleteMany({
            where: {
                id: parseInt(id),
                usuarioId: req.usuario.id, // Seguridad
            },
        });

        if (count.count === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ error: "Error al eliminar" });
    }
};

export const getPublicProductsByUserId = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const productos = await prisma.producto.findMany({
            where: {
                usuarioId: parseInt(usuarioId),
                activo: true, // Solo mostramos los que están activos
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener productos públicos" });
    }
};
