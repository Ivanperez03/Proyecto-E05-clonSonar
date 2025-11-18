import { Request, Response } from "express";
import { planSubRepo } from "../plan_sub/plan_sub.repositoy";  
import { miembroGrupoRepo } from "../miembro_grupo/miembro_grupo.repository";
import { userRepo } from "../users/user.repository";

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
  // planes activos por plataforma (para tu vista de "Planes para Netflix")
  async getActivePlansForPlatform(req: Request, res: Response) {
    const id_plataforma = Number(req.params.id_plataforma);
    if (Number.isNaN(id_plataforma)) {
      return res.status(400).json({ message: "id_plataforma inválido" });
    }

    try {
      const planes = await planSubRepo.getActivePlansByPlatformId(id_plataforma);
      return res.json(planes);
    } catch (error: any) {
      console.error("Error obteniendo planes activos:", error);
      return res.status(500).json({ message: "Error al obtener planes activos", error: error.message });
    }
  },
  // unirse al grupo de un plan
  async joinPlanGroup(req: Request, res: Response) {
    const id_plan = Number(req.params.id_plan);
    if (Number.isNaN(id_plan)) {
      return res.status(400).json({ message: "id_plan inválido" });
    }

    try {
      // ⬇⬇ IGUAL QUE EN createGroup
      const jwtPayload = (req as any).jwt as { email: string };
      if (!jwtPayload?.email) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const user = await userRepo.findByEmail(jwtPayload.email);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const id_usuario = user.id_usuario;

      const plan = await planSubRepo.getPlanById(id_plan);
      if (!plan) {
        return res.status(404).json({ message: "Plan no encontrado" });
      }

      if (plan.estado_grupo !== "abierto") {
        return res.status(400).json({ message: "El grupo de este plan no está abierto" });
      }

      const yaMiembro = await miembroGrupoRepo.isUserInGroup(
        plan.id_grupo,
        id_usuario
      );
      if (yaMiembro) {
        return res.status(400).json({ message: "Ya eres miembro de este grupo" });
      }

      await miembroGrupoRepo.addMemberToGroup({
        id_grupo: plan.id_grupo,
        id_usuario,
      });

      return res.status(201).json({
        message: "Te has unido al grupo correctamente",
        id_grupo: plan.id_grupo,
      });
    } catch (error: any) {
      console.error("Error al unirse al grupo:", error);
      return res
        .status(500)
        .json({ message: "Error al unirse al grupo", error: error.message });
    }
  },
};
