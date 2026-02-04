import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req, res) => {
    // ... (Tu código de login se mantiene igual, no lo toco)
    const { email, password } = req.body;
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        if (!usuario.activo) return res.status(403).json({ error: "Cuenta desactivada" });
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) return res.status(401).json({ error: "Contraseña incorrecta" });
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const { password: _, ...usuarioSinPass } = usuario;
        res.json({ token, usuario: usuarioSinPass });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// REGISTRAR EMPRENDEDORA (Corregido: Agregada ocupación y fecha)
export const registrarEmprendedora = async (req, res) => {
    const { nombre, email, password, telefono, ubicacion, ocupacion, fechaNacimiento } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Convertir fecha de string a Date si viene
        const fechaNac = fechaNacimiento ? new Date(fechaNacimiento) : null;

        const nuevaEmprendedora = await prisma.usuario.create({
            data: {
                nombre,
                email,
                password: hashedPassword,
                rol: "EMPRENDEDORA",
                telefono,
                ubicacion,
                ocupacion,          // <--- AHORA SÍ SE GUARDA
                fechaNacimiento: fechaNac, // <--- AHORA SÍ SE GUARDA
                configuracion: {
                    create: { nombreMarca: `Le Bisou - ${nombre}` },
                },
                catalogo: {
                    create: { tituloPestana: `Catálogo de ${nombre}` },
                },
            },
        });

        res.json({
            message: "Emprendedora registrada con éxito",
            usuario: nuevaEmprendedora.email,
        });
    } catch (error) {
        console.error(error);
        if (error.code === "P2002") {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }
        res.status(500).json({ error: "Error al crear usuario" });
    }
};

// ACTUALIZAR PERFIL (Actualizado con Email, Ocupación y Fecha)
export const updateProfile = async (req, res) => {
    const { nombre, email, telefono, ubicacion, ocupacion, fechaNacimiento } = req.body;
    const usuarioId = req.usuario.id;

    try {
        // Convertir fecha de string a Date si viene
        const fechaNac = fechaNacimiento ? new Date(fechaNacimiento) : undefined;

        // Validar si quiere cambiar el email, que no exista otro igual
        if (email) {
            const existeEmail = await prisma.usuario.findFirst({
                where: {
                    email: email,
                    NOT: { id: usuarioId } // Que no sea yo mismo
                }
            });
            if (existeEmail) {
                return res.status(400).json({ error: "Ese correo ya está en uso por otra persona" });
            }
        }

        const usuarioActualizado = await prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                nombre,
                email, // <--- AHORA SE ACTUALIZA
                telefono,
                ubicacion,
                ocupacion, // <--- AHORA SE ACTUALIZA
                fechaNacimiento: fechaNac // <--- AHORA SE ACTUALIZA
            }
        });

        const { password, ...usuarioSinPass } = usuarioActualizado;

        res.json({
            message: "Perfil actualizado correctamente",
            usuario: usuarioSinPass
        });

    } catch (error) {
        console.error("Error updateProfile:", error);
        res.status(500).json({ error: "Error al actualizar perfil" });
    }
};

// CAMBIAR CONTRASEÑA (Igual que antes)
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const usuarioId = req.usuario.id;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        const passwordValido = await bcrypt.compare(currentPassword, usuario.password);
        if (!passwordValido) return res.status(401).json({ error: "La contraseña actual es incorrecta" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.usuario.update({
            where: { id: usuarioId },
            data: { password: hashedPassword }
        });

        res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al cambiar contraseña" });
    }
};
