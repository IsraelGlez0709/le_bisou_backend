import { Router } from "express";
import {
    getMyCatalogConfig,
    publishCatalog,
    getPublicCatalogByUserId,
} from "../controllers/catalogo.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas privadas (Para que la emprendedora edite SU catálogo)
router.get("/config", verificarToken, getMyCatalogConfig);
router.put("/publicar", verificarToken, publishCatalog);

// Ruta PÚBLICA (Para que los clientes vean el catálogo)
// No lleva verificarToken
router.get("/view/:usuarioId", getPublicCatalogByUserId);

export default router;
