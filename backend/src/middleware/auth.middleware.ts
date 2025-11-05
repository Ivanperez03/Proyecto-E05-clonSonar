import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
}
