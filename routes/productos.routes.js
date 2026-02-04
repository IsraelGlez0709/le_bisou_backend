import { Router } from "express";
import {
    getProductos,
    createProducto,
    updateProducto,
    deleteProducto,
    getPublicProductsByUserId,
} from "../controllers/productos.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", verificarToken, getProductos);
router.post("/", verificarToken, upload.single("imagen"), createProducto);
router.put("/:id", verificarToken, upload.single("imagen"), updateProducto); // ¡Aquí está el update!
router.delete("/:id", verificarToken, deleteProducto);
router.get("/public/:usuarioId", getPublicProductsByUserId);

export default router;
