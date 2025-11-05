import { Router } from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const r = Router();
r.post("/", userController.register);
r.post("/login", userController.login);
r.get("/me", verifyToken, userController.me);
r.post("/logout", userController.logout);
export default r;
