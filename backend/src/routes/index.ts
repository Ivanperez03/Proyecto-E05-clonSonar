import { Router } from "express";
import userRouter from "../modules/users/user.router";
import plataformaRouter from "../modules/plataforma/plataforma.router";
import planSubRouter from "../modules/plan_sub/plan_sub.router";
import grupoRouter from "../modules/grupo/grupo.router";
import miembroGrupoRouter from "../modules/miembro_grupo/miembro_grupo.router";
import carteraRouter from "../modules/cartera/cartera.router";
import adminRouter from "../modules/adminfuncs/admin.router"; // 👈 nuevo
import { authMiddleware } from "../middleware/auth.middleware";
import { userController } from "../modules/users/user.controller";

const router = Router();

// === USERS ===
router.use("/users", userRouter);
router.get("/me", authMiddleware, userController.me);
router.get("/user/data", authMiddleware, userController.getUserData);

// === PLATAFORMA ===
router.use("/plataforma", plataformaRouter);

// === PLAN_SUB ===
router.use("/plan_sub", planSubRouter);

// === GRUPO ===
router.use("/grupo", grupoRouter);

// === MIEMBRO_GRUPO ===
router.use("/miembro_grupo", miembroGrupoRouter);

// === CARTERA ===
router.use("/cartera", carteraRouter);

// === ADMIN ===
router.use("/admin", adminRouter); // 👈 necesario para panel admin

export default router;
