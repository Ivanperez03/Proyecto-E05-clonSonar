import { Request, Response } from "express";
import { planSubRepo } from "../plan_sub/plan_sub.repositoy";  

export const planSubController = {
  async createSubscription(req: Request, res: Response) {
    const { id_plataforma, precio ,fecha_vencimiento, id_grupo } = req.body;  // Añadimos id_plataforma y precio
    // Validación de los campos obligatorios
    if (!id_plataforma || !precio || !fecha_vencimiento || !id_grupo) {
      return res.status(400).json({ message: "Faltan campos" });
    }
    try {
      // Crear suscripción en la base de datos
      const subscription = await planSubRepo.createSubscription({
        id_grupo, 
        id_plataforma, 
        precio, 
        fecha_vencimiento,
      });

      // Responder con el éxito de la creación
      return res.status(201).json({
        message: "Suscripción creada con éxito",
        subscription,
      });
    } catch (error: any) {
      console.error("Error creando la suscripción:", error);
      return res.status(500).json({ message: "Error al crear suscripción", error: error.message });
    }
  },
};
