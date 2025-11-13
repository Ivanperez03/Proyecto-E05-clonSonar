import { Request, Response } from 'express';
import { userService } from './user.service';
import jwt from "jsonwebtoken";
import { ENV } from '../../config/env';
import { userRepo } from "./user.repository";
import { carteraRepo } from "../cartera/cartera.repository";
import { planSubRepo } from "../plan_sub/plan_sub.repositoy";
import { grupoRepo } from '../grupo/grupo.repository';

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { nombre, email, telefono, password, admin } = req.body;

      if (!nombre || !email || !telefono || !password)
        return res.status(400).json({ message: 'Faltan campos' });

      // Crear usuario pasando admin (true/false)
      const user = await userService.register({ nombre, email, telefono, password, admin: !!admin });
      await carteraRepo.createCartera(user.id_usuario);

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
      // JWT con email y rol
      const token = jwt.sign(
        { email: user.mail, admin: user.rol === 'admin' }, 
        ENV.JWT_SECRET as string,
        { expiresIn: "1h" } // 1 hora de ejemplo
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 1000
        })
        .json({
          message: "Inicio de sesión correcto",
          user: {
            id: user.id_usuario,
            nombre: user.nombre,
            email: user.mail,
            telefono: user.telefono,
            rol: user.rol,
          },
        });
    } catch {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  },
  async me(req: Request, res: Response) {
    const jwtPayload = (req as any).jwt as { email: string, admin?: boolean };
    if (!jwtPayload?.email)
      return res.status(401).json({ message: "No autorizado" });

    const u = await userRepo.findByEmail(jwtPayload.email);
    console.log("Usuario completo desde DB:", u);
    if (!u)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      user: {
        id: u.id_usuario,
        nombre: u.nombre,
        email: u.mail,
        telefono: u.telefono,
        tipo: u.tipo,
      },
    });
  },
  async logout(_req: Request, res: Response) {
    res
      .clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" })
      .json({ message: "Sesión cerrada" });
  },
  async getUserData(req: Request, res: Response) {
    const jwtPayload = (req as any).jwt as { email: string };
    if (!jwtPayload?.email)
      return res.status(401).json({ message: "No autorizado" });

    const u = await userRepo.findByEmail(jwtPayload.email);
    if (!u)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const id_usuario = u.id_usuario;

    const [cartera, grupos, suscripciones] = await Promise.all([
      carteraRepo.findByUserId(id_usuario),
      grupoRepo.getGruposByUserId(id_usuario),
      planSubRepo.getActiveSubscriptionsByUserId(id_usuario),
    ]);

    res.json({
      user: {
        id: u.id_usuario,
        nombre: u.nombre,
        email: u.mail,
        telefono: u.telefono,
        tipo: u.tipo,
      },
      saldo: cartera?.saldo ?? 0,
      grupos,
      suscripciones,
    });
  }
};