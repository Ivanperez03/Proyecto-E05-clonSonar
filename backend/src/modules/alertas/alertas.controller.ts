import { Request, Response } from "express";
import {
  findAlertasByUsuario,
  markAllAlertasRead,
  markAlertaRead,
} from "./alertas.repository";
import { userRepo } from "../users/user.repository";

// Este tipo NO usa req.user, usa req.jwt (como tu backend)
interface AuthJWT {
  email: string;
  admin?: boolean;
}

export async function getAlertas(req: Request, res: Response) {
  const jwtPayload = (req as any).jwt as AuthJWT;
  if (!jwtPayload?.email)
    return res.status(401).json({ message: "No autenticado" });

  const user = await userRepo.findByEmail(jwtPayload.email);
  if (!user)
    return res.status(404).json({ message: "Usuario no encontrado" });

  try {
    const rows = await findAlertasByUsuario(user.id_usuario);

    const data = rows.map((row) => ({
      id: row.id_alerta,
      mensaje: row.mensaje,
      tipo: row.tipo,
      vista: row.leida,
      fecha: row.fecha_creacion,
      createdAt: row.fecha_creacion,
    }));

    return res.json(data);
  } catch (err) {
    console.error("Error getAlertas:", err);
    return res.status(500).json({ message: "Error obteniendo alertas" });
  }
}

export async function marcarTodasAlertasVistas(req: Request, res: Response) {
  const jwtPayload = (req as any).jwt as AuthJWT;
  if (!jwtPayload?.email)
    return res.status(401).json({ message: "No autenticado" });

  const user = await userRepo.findByEmail(jwtPayload.email);
  if (!user)
    return res.status(404).json({ message: "Usuario no encontrado" });

  try {
    await markAllAlertasRead(user.id_usuario);
    return res.status(204).send();
  } catch (err) {
    console.error("Error marcarTodasAlertasVistas:", err);
    return res.status(500).json({ message: "Error marcando alertas" });
  }
}

export async function marcarAlertaVista(req: Request, res: Response) {
  const jwtPayload = (req as any).jwt as AuthJWT;
  if (!jwtPayload?.email)
    return res.status(401).json({ message: "No autenticado" });

  const user = await userRepo.findByEmail(jwtPayload.email);
  if (!user)
    return res.status(404).json({ message: "Usuario no encontrado" });

  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID de alerta inválido" });
  }

  try {
    const row = await markAlertaRead(id, user.id_usuario);
    if (!row) {
      return res.status(404).json({ message: "Alerta no encontrada" });
    }

    const dto = {
      id: row.id_alerta,
      mensaje: row.mensaje,
      tipo: row.tipo,
      vista: !row.leida,
      fecha: row.fecha_creacion,
      createdAt: row.fecha_creacion,
    };

    return res.json(dto);
  } catch (err) {
    console.error("Error marcarAlertaVista:", err);
    return res.status(500).json({ message: "Error marcando alerta" });
  }
}
