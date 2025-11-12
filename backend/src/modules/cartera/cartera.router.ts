import { Router } from "express";
import { carteraController } from "./cartera.controller";  

const router = Router();

// Ruta para obtener el saldo de un usuario
router.get("/:id_usuario", carteraController.getSaldo);

// Ruta para actualizar el saldo de un usuario
router.put("/:id_usuario", carteraController.updateSaldo);

// Ruta para crear una nueva cartera (si no existe)
router.post("/", carteraController.createCartera);

export default router;