import { Request, Response } from 'express';
import { userService } from './user.service';
import jwt from "jsonwebtoken";
import { ENV } from '../../config/env';
import { userRepo } from "./user.repository";
import { carteraRepo } from "../cartera/cartera.repository";
import { planSubRepo } from "../plan_sub/plan_sub.repositoy";
import { miembroGrupoRepo } from "../miembro_grupo/miembro_grupo.repository"; // Asegúrate de importar

export const userController = {
  // Registro de usuario
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

  // Login de usuario
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

  // Obtener datos del usuario actual
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

  // Cerrar sesión
  async logout(_req: Request, res: Response) {
    res
      .clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" })
      .json({ message: "Sesión cerrada" });
  },

  // Obtener datos completos de un usuario
  async getUserData(req: Request, res: Response) {
    const emailId = (req as any).jwt?.email;  // JWT debe contener el email
    try {
      const user = await userRepo.findByEmail(emailId);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      const saldo = await carteraRepo.getSaldoByUserId(user.id_usuario);
      const grupos = await miembroGrupoRepo.getMembersByUserId(user.id_usuario);
      //const suscripciones = await planSubRepo.getActiveSubscriptions(user.id_usuario);
      const suscripciones: any[] = [];
      const suscripcionesConTiempoRestante = suscripciones.map((suscripcion) => ({
        ...suscripcion,
        tiempoRestante: calculateTimeRemaining(suscripcion.fecha_vencimiento)
      }));

      const plataformas = await planSubRepo.getPlataformasByUserId(user.id_usuario);

      res.json({
        user,
        saldo,
        grupos,
        suscripciones: suscripcionesConTiempoRestante,
        plataformas,
      });
    } catch (error: any) {
      console.error("Error obteniendo los datos del usuario:", error);
      return res.status(500).json({ message: "Error al obtener los datos", error: error.message });
    }
  },
};

function calculateTimeRemaining(fecha_vencimiento: Date) {
  const now = new Date();
  const vencimiento = new Date(fecha_vencimiento);
  const diffTime = vencimiento.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
  return diffDays;
}
