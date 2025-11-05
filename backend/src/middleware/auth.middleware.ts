// src/middleware/auth.middleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env";

// src/middleware/auth.middleware.ts
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const bearer = req.header("Authorization");
  const fromHeader = bearer?.startsWith("Bearer ") ? bearer.slice(7) : null;
  const fromCookie = (req as any).cookies?.token as string | undefined;
  const token = fromCookie || fromHeader;
  if (!token) return res.status(401).json({ message: "No autorizado (falta token)" });
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET as string);
    (req as any).jwt = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
