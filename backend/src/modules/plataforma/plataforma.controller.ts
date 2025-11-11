import { Request, Response } from "express";
import { plataformaRepo } from "./plataforma.repository";

export const plataformaController = {
  async getAllPlatforms(req: Request, res: Response) {
    try {
      const plataformas = await plataformaRepo.getAllPlatforms();
      return res.json(plataformas);
    } catch (error: any) {
      console.error("Error obteniendo plataformas:", error);
      return res.status(500).json({ message: "Error al obtener plataformas", error: error.message });
    }
  }
};
