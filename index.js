import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server } from "socket.io";

// Importar Rutas
import authRoutes from "./routes/auth.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import configuracionRoutes from "./routes/configuracion.routes.js";
import catalogoRoutes from "./routes/catalogo.routes.js";

// Importar Middleware de Upload (Ya configurado con Cloudinary)
import upload from "./middlewares/upload.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Definir orígenes permitidos (Local y Producción)
const allowedOrigins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL // Tu dominio real (ej: https://le-bisou.vercel.app)
];

// Configuración Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
});

// Middleware Globales
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Pasar 'io' a las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- ELIMINADO: Carpeta local de imágenes ---
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
// Ya no sirve archivos estáticos locales, Cloudinary se encarga.

// Rutas de Upload Simple (Modificada para Cloudinary)
app.post("/api/upload", upload.single("imagen"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Sin imagen" });
    
    // Cloudinary nos devuelve la URL en 'path'
    // Devolvemos 'filename' con la URL completa para mantener compatibilidad
    // con tu frontend actual, aunque lo ideal es guardar la URL entera.
    res.json({ filename: req.file.path }); 
});

// --- RUTAS MODULARES ---
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/config", configuracionRoutes);
app.use("/api/catalogo", catalogoRoutes);

// Iniciar Servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor Cloudinary corriendo en puerto ${PORT}`);
});