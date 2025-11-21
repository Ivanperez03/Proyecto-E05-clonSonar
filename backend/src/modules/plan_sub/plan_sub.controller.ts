import { Request, Response } from "express";
import { planSubRepo } from "../plan_sub/plan_sub.repositoy";  
import { miembroGrupoRepo } from "../miembro_grupo/miembro_grupo.repository";
import { userRepo } from "../users/user.repository";

export const planSubController = {
  async createSubscription(req: Request, res: Response) {
    try {
      const { id_plataforma, precio, fecha_vencimiento, id_grupo, nmiembros } = req.body;
  
      // Validación
      if (!id_plataforma || !precio || !fecha_vencimiento || !id_grupo || !nmiembros) {
        return res.status(400).json({ message: "Faltan campos", body: req.body });
      }
  
      // Crear suscripción con nmiembros
      const subscription = await planSubRepo.createSubscription({
        id_grupo, 
        id_plataforma, 
        precio, 
        fecha_vencimiento,
        nmiembros
      });
  
      return res.status(201).json({
        message: "Suscripción creada con éxito",
        subscription,
      });
    } catch (error: any) {
      console.error("Error creando la suscripción:", error);
      return res.status(500).json({ message: "Error al crear suscripción", error: error.message });
    }
  },
  async getActivePlansForPlatform(req: Request, res: Response) {
    try {
      console.log("==== getActivePlansForPlatform ====");
      console.log("Params recibidos:", req.params);

      const id_plataforma = Number(req.params.id_plataforma);
      if (Number.isNaN(id_plataforma)) {
        console.warn("id_plataforma inválido:", req.params.id_plataforma);
        return res.status(400).json({ message: "id_plataforma inválido" });
      }

      const planes = await planSubRepo.getActivePlansByPlatformId(id_plataforma);
      console.log("Planes encontrados:", planes);
      return res.json(planes);
    } catch (error: any) {
      console.error("Error obteniendo planes activos:", error);
      return res.status(500).json({ message: "Error al obtener planes activos", error: error.message });
    }
  },

  async joinPlanGroup(req: Request, res: Response) {
    try {
      console.log("==== joinPlanGroup ====");
      console.log("Params recibidos:", req.params);

      const id_plan = Number(req.params.id_plan);
      if (Number.isNaN(id_plan)) {
        console.warn("id_plan inválido:", req.params.id_plan);
        return res.status(400).json({ message: "id_plan inválido" });
      }

      const jwtPayload = (req as any).jwt as { email: string };
      if (!jwtPayload?.email) {
        console.warn("JWT no tiene email:", jwtPayload);
        return res.status(401).json({ message: "No autorizado" });
      }

      const user = await userRepo.findByEmail(jwtPayload.email);
      if (!user) {
        console.warn("Usuario no encontrado:", jwtPayload.email);
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const id_usuario = user.id_usuario;

      const plan = await planSubRepo.getPlanById(id_plan);
      if (!plan) {
        console.warn("Plan no encontrado:", id_plan);
        return res.status(404).json({ message: "Plan no encontrado" });
      }

      if (plan.estado_grupo !== "abierto") {
        console.warn("Grupo cerrado:", plan.estado_grupo);
        return res.status(400).json({ message: "El grupo de este plan no está abierto" });
      }

      const yaMiembro = await miembroGrupoRepo.isUserInGroup(plan.id_grupo, id_usuario);
      if (yaMiembro) {
        console.warn("Usuario ya miembro:", id_usuario, plan.id_grupo);
        return res.status(400).json({ message: "Ya eres miembro de este grupo" });
      }

      await miembroGrupoRepo.addMemberToGroup({ id_grupo: plan.id_grupo, id_usuario });

      console.log("Usuario añadido al grupo:", { id_usuario, id_grupo: plan.id_grupo });
      return res.status(201).json({ message: "Te has unido al grupo correctamente", id_grupo: plan.id_grupo });
    } catch (error: any) {
      console.error("Error al unirse al grupo:", error);
      return res.status(500).json({ message: "Error al unirse al grupo", error: error.message });
    }
  },
};
