import { Request, Response } from "express";
import { grupoRepo } from "../grupo/grupo.repository"; 

export const grupoController = {
  async createGroup(req: Request, res: Response) {
    const { nombre, id_jefe } = req.body;
    if (!nombre || !id_jefe) {
      return res.status(400).json({ message: "Faltan campos" });
    }
    try {
      const group = await grupoRepo.createGroup({ nombre, id_jefe });
      return res.status(201).json({
        message: "Grupo creado con éxito",
        group,
      });
    } catch (error: any) {
      console.error("Error creando el grupo:", error);
      return res.status(500).json({ message: "Error al crear el grupo", error: error.message });
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
