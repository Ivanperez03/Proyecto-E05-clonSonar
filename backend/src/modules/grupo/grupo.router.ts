import { Router } from "express";
import { grupoController } from "./grupo.controller";  

const router = Router();

// Ruta para crear un nuevo grupo
router.post("/create", grupoController.createGroup);
// Ruta para obtener todos los grupos
router.get("/", grupoController.getAllGroups);
// Ruta para obtener un grupo por ID
router.get("/:id_grupo", grupoController.getGroupById);

export default router;
