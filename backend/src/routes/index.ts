import { Application } from "express";
import userRouter from "../modules/users/user.router";

export function registerRoutes(app: Application) {
  app.use("/api/users", userRouter); 
}
