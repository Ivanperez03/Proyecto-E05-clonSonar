// src/routes/alertas.routes.ts
import { Router } from "express";
import {
  getAlertas,
  marcarTodasAlertasVistas,
  marcarAlertaVista,
} from "./alertas.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware); // todas las rutas de alertas requieren login

router.get("/", getAlertas);
router.post("/marcar-todas-vistas", marcarTodasAlertasVistas);
router.post("/:id/vista", marcarAlertaVista);

export default router;
