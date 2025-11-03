import { Request, Response } from 'express';
import { userService } from './user.service';

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
      if (!email || !password) return res.status(400).json({ message: 'Faltan campos' });
      const user = await userService.login(email, password);
      res.json(user);
    } catch {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  },
};
