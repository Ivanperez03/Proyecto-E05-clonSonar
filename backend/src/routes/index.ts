import { Router } from "express";
import userRouter from "../modules/users/user.router";
import { authMiddleware } from "../middleware/auth.middleware";
import { userController } from "../modules/users/user.controller";

const router = Router();

router.use("/users", userRouter);
router.get("/me", authMiddleware, userController.me);

export default router;
