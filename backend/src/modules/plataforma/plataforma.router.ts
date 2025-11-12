import { Router } from "express";
import { plataformaController } from "./plataforma.controller";

const router = Router();

// Ruta para obtener todas las plataformas
router.get("/", plataformaController.getAllPlatforms);

export default router;
