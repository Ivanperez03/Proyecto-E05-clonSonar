// TODO maybe una function de getbyID para plataforma


import { Router } from "express";
import userRouter from "../modules/users/user.router";  // Rutas de usuario
import plataformaRouter from "../modules/plataforma/plataforma.router";  // Rutas de plataforma
import planSubRouter from "../modules/plan_sub/plan_sub.router";  // Rutas de plan_sub
import grupoRouter from "../modules/grupo/grupo.router";  // Rutas de grupo
import { authMiddleware } from "../middleware/auth.middleware";  // Middleware de autenticación
import { userController } from "../modules/users/user.controller";  // Controlador de usuario
import miembroGrupoRouter from "../modules/miembro_grupo/miembro_grupo.router";  // Importar las rutas de miembro_grupo
import carteraRouter from "../modules/cartera/cartera.router";  // Importar las rutas de cartera

const router = Router();

// Rutas de usuario
router.use("/users", userRouter);
router.get("/me", authMiddleware, userController.me);

// Rutas de plataforma
router.use("/plataforma", plataformaRouter);

// Rutas de plan_sub 
router.use("/plan_sub", planSubRouter);

// Rutas de grupo
router.use("/grupo", grupoRouter);

// Rutas de miembro grupo
router.use("/miembro_grupo", miembroGrupoRouter);

router.use("/cartera", carteraRouter);

router.get("/user/data", authMiddleware, userController.getUserData);

export default router;