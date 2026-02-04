// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // 1. Encriptar contraseña (ej: "admin123")
    const passwordHash = await bcrypt.hash("admin123", 10);

    // 2. Crear Usuario Admin
    const admin = await prisma.usuario.upsert({
        where: { email: "admin@lebisou.com" },
        update: {},
        create: {
            email: "admin@lebisou.com",
            password: passwordHash,
            nombre: "Dueña Le Bisou",
            rol: "ADMIN",
            // Creamos su configuración por defecto
            configuracion: {
                create: {
                    nombreMarca: "Le Bisou Joyería",
                    colorMarca: "#fbcdcf",
                },
            },
            // Creamos su catálogo vacío
            catalogo: {
                create: {
                    tituloPestana: "Catálogo Oficial",
                },
            },
        },
    });

    console.log({ admin });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
