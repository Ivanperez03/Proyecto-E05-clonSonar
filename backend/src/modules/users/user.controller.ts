import { Request, Response } from 'express';
import { userService } from './user.service';
import jwt from "jsonwebtoken";
import { ENV } from '../../config/env';
import { userRepo } from "./user.repository";

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { nombre, email, telefono, password } = req.body;
      if (!nombre || !email || !telefono || !password)
        return res.status(400).json({ message: 'Faltan campos' });

      const user = await userService.register({ nombre, email, telefono, password });
      // user = { id_usuario, nombre, mail, telefono }
      res.status(201).json(user);
    } catch (e: any) {
      const msg = e?.message === 'Email o teléfono ya existe' ? e.message : 'Error registrando usuario';
      res.status(msg === e.message ? 409 : 500).json({ message: msg, detail: e?.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Faltan campos" });

      const user = await userService.login(email, password);
      // user = { id_usuario, nombre, mail, telefono }
      const token = jwt.sign(
        { email: user.mail },           // 🔐 el JWT almacena el email
        ENV.JWT_SECRET as string,
        { expiresIn: "1m" }
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,     // en prod: true (HTTPS) + SameSite: "none"
          sameSite: "lax",
          maxAge: 60 * 1000
        })
        .json({
          message: "Inicio de sesión correcto",
          user: {
            id: user.id_usuario,        // ✅ FIX: antes ponías user.id
            nombre: user.nombre,
            email: user.mail,
            telefono: user.telefono,
          },
        });
    } catch {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  },

  async me(req: Request, res: Response) {
    const jwtPayload = (req as any).jwt as { email: string };
    if (!jwtPayload?.email)
      return res.status(401).json({ message: "No autorizado" });

    const u = await userRepo.findByEmail(jwtPayload.email);
    if (!u)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      user: {
        id: u.id_usuario,
        nombre: u.nombre,
        email: u.mail,
        telefono: u.telefono,
      },
    });
  },

  async logout(_req: Request, res: Response) {
    res
      .clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" }) // prod: secure:true + SameSite:"none"
      .json({ message: "Sesión cerrada" });
  },

};
