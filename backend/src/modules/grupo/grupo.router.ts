import { Router } from "express";
import { grupoController } from "./grupo.controller"; 
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, grupoController.getAllGroups);
router.get("/:id_grupo", authMiddleware, grupoController.getGroupById);
router.post("/", authMiddleware, grupoController.createGroup);

export default router;