import { Router } from "express";
import { getConfig, updateConfig } from "../controllers/configuracion.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verificarToken, getConfig);
router.put("/", verificarToken, updateConfig);

export default router;
