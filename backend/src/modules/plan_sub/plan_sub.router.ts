import { Router } from "express";
import { planSubController } from "../plan_sub/plan_sub.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Crear suscripción
router.post("/subscribe", planSubController.createSubscription);

// listar planes activos de una plataforma
router.get("/plataforma/:id_plataforma/activos", authMiddleware, planSubController.getActivePlansForPlatform);

// unirse al grupo de un plan
router.post("/:id_plan/unirse", authMiddleware, planSubController.joinPlanGroup);

export default router;
