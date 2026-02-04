import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createVenta = async (req, res) => {
    const { clienteId, productos, total } = req.body;
    // productos = [{ id, cantidad, precio, esRegalo }]
    const usuarioId = req.usuario.id;

    try {
        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Crear la Venta vinculada al Usuario
            const venta = await tx.venta.create({
                data: {
                    usuarioId: usuarioId, // IMPORTANTE
                    total: parseFloat(total),
                    clienteId: clienteId || null,
                    fecha: new Date(),
                },
            });

            // 2. Procesar productos
            for (const item of productos) {
                // Verificar que el producto exista y sea del usuario (seguridad extra)
                const productoActual = await tx.producto.findFirst({
                    where: { id: item.id, usuarioId: usuarioId },
                });

                if (!productoActual)
                    throw new Error(
                        `Producto ${item.nombre} no encontrado o no te pertenece`
                    );
                if (productoActual.stock < item.cantidad)
                    throw new Error(`Stock insuficiente para ${item.nombre}`);

                // Restar Stock
                await tx.producto.update({
                    where: { id: item.id },
                    data: { stock: productoActual.stock - item.cantidad },
                });

                // Crear Detalle
                await tx.detalleVenta.create({
                    data: {
                        ventaId: venta.id,
                        productoId: item.id,
                        cantidad: item.cantidad,
                        precioUnitario: parseFloat(item.precio),
                        esRegalo: item.esRegalo || false,
                    },
                });
            }

            return venta;
        });

        // 3. Notificación WebSocket (Solo a este usuario si implementas rooms, o global por ahora)
        if (req.io) {
            // Opcional: emitir solo a un "room" del usuario
            // req.io.to(`user_${usuarioId}`).emit(...)

            // Por ahora emitimos genérico, el front debe filtrar si es necesario recargar
            req.io.emit("server:stock_actualizado", { usuarioId });
        }

        res.json({ message: "Venta exitosa", venta: resultado });
    } catch (error) {
        console.error("Error en venta:", error);
        res.status(400).json({
            error: error.message || "Error al procesar la venta",
        });
    }
};

// GET: Historial de Ventas (Opcional, si lo necesitas)
export const getVentas = async (req, res) => {
    try {
        const ventas = await prisma.venta.findMany({
            where: { usuarioId: req.usuario.id },
            include: { cliente: true, detalles: { include: { producto: true } } },
            orderBy: { fecha: "desc" },
        });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener historial" });
    }
};
