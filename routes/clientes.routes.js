import { Router } from "express";
import { getClientes, createCliente } from "../controllers/clientes.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verificarToken, getClientes);
router.post("/", verificarToken, createCliente);

export default router;
