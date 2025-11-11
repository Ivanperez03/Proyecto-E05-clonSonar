import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const r = Router();
r.post("/", userController.register);
r.post("/login", userController.login);
r.get("/me", authMiddleware, userController.me, userController.getAccountData);
r.post("/logout", userController.logout);
export default r;
