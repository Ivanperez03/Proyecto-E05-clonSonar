import { Request, Response } from "express";
import { carteraRepo } from "./cartera.repository";  // Repositorio para manejar la cartera

export const carteraController = {
  // Obtener el saldo de un usuario
  async getSaldo(req: Request, res: Response) {
    const { id_usuario } = req.params;

    try {
      const saldo = await carteraRepo.getSaldoByUserId(Number(id_usuario));
      if (saldo === null) {
        return res.status(404).json({ message: "Cartera no encontrada para el usuario" });
      }
      return res.json({ saldo });
    } catch (error: any) {
      console.error("Error obteniendo el saldo:", error);
      return res.status(500).json({ message: "Error al obtener el saldo", error: error.message });
    }
  },

  // Actualizar el saldo de un usuario
  async updateSaldo(req: Request, res: Response) {
    const { id_usuario } = req.params;
    const { saldo } = req.body;

    if (saldo < 0) {
      return res.status(400).json({ message: "El saldo no puede ser negativo" });
    }

    try {
      const updatedCartera = await carteraRepo.updateSaldo(Number(id_usuario), saldo);
      return res.json({
        message: "Saldo actualizado correctamente",
        updatedCartera,
      });
    } catch (error:any) {
      console.error("Error actualizando el saldo:", error);
      return res.status(500).json({ message: "Error al actualizar el saldo", error: error.message });
    }
  },

  // Crear una cartera para un usuario (si no existe)
  async createCartera(req: Request, res: Response) {
    const { id_usuario } = req.body;

    try {
      const cartera = await carteraRepo.createCartera(id_usuario);
      return res.status(201).json({
        message: "Cartera creada con éxito",
        cartera,
      });
    } catch (error:any) {
      console.error("Error creando la cartera:", error);
      return res.status(500).json({ message: "Error al crear la cartera", error: error.message });
    }
  },
};
