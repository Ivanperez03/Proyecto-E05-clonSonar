import { Request, Response } from "express";
import { miembroGrupoRepo } from "./miembro_grupo.repository";  
import { createAlerta } from "../alertas/alertas.repository";

export const miembroGrupoController = {
  // Agregar un miembro a un grupo
  async addMember(req: Request, res: Response) {
    const { id_grupo, id_usuario } = req.body;
    if (!id_grupo || !id_usuario) {
      return res.status(400).json({ message: "Faltan campos" });
    }
    try {
      const member = await miembroGrupoRepo.addMemberToGroup({ id_grupo, id_usuario });
      return res.status(201).json({
        message: "Miembro agregado con éxito",
        member,
      });
    } catch (error: any) {
      console.error("Error agregando miembro:", error);
      return res.status(500).json({ message: "Error al agregar miembro", error: error.message });
    }
  },

  // Obtener los miembros de un grupo
  async getMembers(req: Request, res: Response) {
    const { id_grupo } = req.params;

    try {
      const members = await miembroGrupoRepo.getMembersByGroup(Number(id_grupo));
      return res.json(members);
    } catch (error: any) {
      console.error("Error obteniendo los miembros:", error);
      return res.status(500).json({ message: "Error al obtener miembros", error: error.message });
    }
  },

  // Eliminar un miembro de un grupo
  async removeMember(req: Request, res: Response) {
    const { id_grupo, id_usuario } = req.body;
    
    try {
      const member = await miembroGrupoRepo.removeMemberFromGroup({ id_grupo, id_usuario });
      return res.json({
        message: "Miembro eliminado con éxito",
        member,
      });
    } catch (error: any) {
      console.error("Error eliminando miembro:", error);
      return res.status(500).json({ message: "Error al eliminar miembro", error: error.message });
    }
  },
};
