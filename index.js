import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "node:http";
import { Server } from "socket.io";

// Importar Rutas
import authRoutes from "./routes/auth.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import configuracionRoutes from "./routes/configuracion.routes.js";
import catalogoRoutes from "./routes/catalogo.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Tus URL de frontend
        methods: ["GET", "POST", "PUT"],
    },
});

// Middleware Globales
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Pasar 'io' a las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Carpeta de Imágenes Pública
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas de Upload Simple (si se necesita fuera de productos)
import upload from "./middlewares/upload.middleware.js";
app.post("/api/upload", upload.single("imagen"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Sin imagen" });
    res.json({ filename: req.file.filename });
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
    console.log(`Servidor Multi-Usuario corriendo en http://localhost:${PORT}`);
});
