import { Request, Response } from "express";
import { grupoRepo } from "../grupo/grupo.repository"; 
import { miembroGrupoRepo } from "../miembro_grupo/miembro_grupo.repository";
import { userRepo } from "../users/user.repository";

export const grupoController = {
async createGroup(req: Request, res: Response) {
  try {
    const jwtPayload = (req as any).jwt as { email: string };
    if (!jwtPayload?.email)
      return res.status(401).json({ message: "No autorizado" });
    const jefe = await userRepo.findByEmail(jwtPayload.email);
    if (!jefe)
      return res.status(404).json({ message: "Usuario no encontrado" });
    const { nombre } = req.body;
    if (!nombre)
      return res.status(400).json({ message: "Falta el nombre del grupo" });
    const group = await grupoRepo.createGroup({
      nombre,
      id_jefe: jefe.id_usuario,
    });
    await miembroGrupoRepo.addUserToGroup(jefe.id_usuario, group.id_grupo);
    return res.status(201).json({
      message: "Grupo creado con éxito",
      group,
    });
  } catch (error: any) {
    console.error("Error creando el grupo:", error);
    return res.status(500).json({
      message: "Error al crear el grupo",
      error: error.message,
    });
  }
  },
  async getAllGroups(req: Request, res: Response) {
    try {
      const groups = await grupoRepo.getAllGroups();
      return res.json(groups);
    } catch (error: any) {
      console.error("Error obteniendo los grupos:", error);
      return res.status(500).json({ message: "Error al obtener los grupos", error: error.message });
    }
  },

  async getGroupById(req: Request, res: Response) {
    const { id_grupo } = req.params;
    try {
      const group = await grupoRepo.findById(Number(id_grupo));
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }
      return res.json(group);
    } catch (error: any) {
      console.error("Error obteniendo el grupo:", error);
      return res.status(500).json({ message: "Error al obtener el grupo", error: error.message });
    }
  },
};
