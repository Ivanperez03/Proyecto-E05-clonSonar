import { Request, Response } from "express";
import { carteraRepo } from "./cartera.repository";

export const carteraController = {

  // === OBTENER SALDO ===
  async getSaldo(req: Request, res: Response) {
    const { id_usuario } = req.params;
    try {
      const cartera = await carteraRepo.findByUserId(Number(id_usuario));
      if (!cartera) {
        return res.status(404).json({ message: "Cartera no encontrada" });
      }
      return res.json(cartera); // { id_usuario, saldo }
    } catch (error: any) {
      console.error("Error obteniendo saldo:", error);
      return res.status(500).json({ message: "Error al obtener saldo", error: error.message });
    }
  },

  // === CREAR CARTERA ===
  async createCartera(req: Request, res: Response) {
    const { id_usuario } = req.body;
    try {
      const cartera = await carteraRepo.createCartera(Number(id_usuario));
      return res.status(201).json({ message: "Cartera creada", cartera });
    } catch (error: any) {
      console.error("Error creando cartera:", error);
      return res.status(500).json({ message: "Error creando cartera", error: error.message });
    }
  },

  // === RECARGAR SALDO (SUMAR) ===
  async recargarSaldo(req: Request, res: Response) {
    const { id_usuario } = req.params;
    const { cantidad } = req.body;
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "Cantidad inválida" });
    }

    try {
      // 1️⃣ Verificar si la cartera existe
      let cartera = await carteraRepo.findByUserId(Number(id_usuario));
      if (!cartera) {
        // 2️⃣ Crear cartera si no existe
        cartera = await carteraRepo.createCartera(Number(id_usuario));
      }

      // 3️⃣ Añadir saldo
      const updated = await carteraRepo.addSaldo(Number(id_usuario), cantidad);
      return res.json({ message: "Saldo añadido correctamente", saldo: updated.saldo });
    } catch (error: any) {
      console.error("Error añadiendo saldo:", error);
      return res.status(500).json({ message: "Error añadiendo saldo", error: error.message });
    }
  },

  // === GASTAR SALDO (RESTAR) ===
  async gastarSaldo(req: Request, res: Response) {
    const { id_usuario } = req.params;
    const { cantidad } = req.body;
    if (!cantidad || cantidad <= 0) return res.status(400).json({ message: "Cantidad inválida" });

    try {
      const updated = await carteraRepo.subtractSaldo(Number(id_usuario), cantidad);
      if (!updated) return res.status(400).json({ message: "Saldo insuficiente o cartera inexistente" });
      return res.json({ message: "Saldo descontado correctamente", saldo_restante: updated.saldo });
    } catch (error: any) {
      console.error("Error descontando saldo:", error);
      return res.status(500).json({ message: "Error descontando saldo", error: error.message });
    }
  },

  // === TRANSFERIR GANANCIA AL JEFE ===
  async transferirAlJefe(id_jefe: number, cantidad_total: number) {
    const gananciaJefe = cantidad_total * 0.85;
    return carteraRepo.addSaldo(id_jefe, gananciaJefe);
  }
};
