import { Router } from "express";
import {
    login,
    registrarEmprendedora,
    updateProfile,      // <--- NUEVO
    changePassword      // <--- NUEVO
} from "../controllers/auth.controller.js";
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Ruta pública
router.post("/login", login);

// Rutas protegidas (Admin)
router.post("/register", verificarToken, soloAdmin, registrarEmprendedora);

// Rutas protegidas (Cualquier usuario logueado) <-- NUEVAS RUTAS
router.put("/profile", verificarToken, updateProfile);
router.put("/change-password", verificarToken, changePassword);

export default router;
