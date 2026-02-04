import { Router } from "express";
import { createVenta, getVentas } from "../controllers/ventas.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, createVenta);
router.get("/", verificarToken, getVentas);

export default router;
