import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET: Clientes del usuario
export const getClientes = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({
            where: {
                usuarioId: req.usuario.id,
            },
            orderBy: { nombre: "asc" },
        });
        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar clientes" });
    }
};

// POST: Crear cliente
export const createCliente = async (req, res) => {
    try {
        const { nombre, telefono, email } = req.body;

        const nuevo = await prisma.cliente.create({
            data: {
                usuarioId: req.usuario.id, // VINCULAR AL USUARIO
                nombre,
                telefono,
                email,
            },
        });
        res.json(nuevo);
    } catch (error) {
        console.error(error);
        if (error.code === "P2002") {
            return res
                .status(400)
                .json({ error: "Ya tienes un cliente con este teléfono" });
        }
        res.status(400).json({ error: "Error creando cliente" });
    }
};
