import { Router } from "express";
import { planSubController } from "../plan_sub/plan_sub.controller";

const router = Router();

// Crear suscripción
router.post("/subscribe", planSubController.createSubscription);

export default router;
