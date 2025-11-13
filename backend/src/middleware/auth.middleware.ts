import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; 
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET as string);
    (req as any).jwt = decoded; // guarda los datos decodificados
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
