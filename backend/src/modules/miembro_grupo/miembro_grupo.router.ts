import { Router } from "express";
import { miembroGrupoController } from "./miembro_grupo.controller";  // Controlador de los miembros

const router = Router();

// Ruta para agregar un miembro a un grupo
router.post("/add", miembroGrupoController.addMember);

// Ruta para obtener los miembros de un grupo
router.get("/:id_grupo", miembroGrupoController.getMembers);

// Ruta para eliminar un miembro de un grupo
router.delete("/remove", miembroGrupoController.removeMember);

export default router;
