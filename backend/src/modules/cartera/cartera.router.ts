import { Router } from "express";
import { carteraController } from "./cartera.controller";

const router = Router();

// Obtener saldo
router.get("/:id_usuario", carteraController.getSaldo);

// Recargar saldo (añadir dinero)
router.post("/:id_usuario/recargar", carteraController.recargarSaldo);

// Gastar saldo (descontar saldo, NO comprar subs)
router.post("/:id_usuario/gastar", carteraController.gastarSaldo);

// Crear una cartera (saldo: 0)
router.post("/", carteraController.createCartera);

export default router;
