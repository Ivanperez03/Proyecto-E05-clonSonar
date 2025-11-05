import { Request, Response } from 'express';
import { userService } from './user.service';
import jwt from "jsonwebtoken";
import { ENV } from '../../config/env';


export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { nombre, email, telefono, password } = req.body;
      if (!nombre || !email || !telefono || !password)
        return res.status(400).json({ message: 'Faltan campos' });
      const user = await userService.register({ nombre, email, telefono, password });
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
      const token = jwt.sign(
        { id: user.id, email: user.email },
        ENV.JWT_SECRET as string,
        { expiresIn: "1m" }
      );
      // Devolver token + datos del usuario (sin contraseña)
      res
      .cookie("token", token, {
        httpOnly: true,    // 🔒 no accesible desde JS
        secure: false,     // 🔐 cambia a true en producción (HTTPS)
        sameSite: "lax",   // o "none" si usas dominios diferentes
        maxAge: 60 * 1000  // 1 minuto en milisegundos
      })
      .json({
        message: "Inicio de sesión correcto",
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono,
        },
      });
    } catch {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  }
};
