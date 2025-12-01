import { Request, Response } from "express";
import { planSubRepo } from "../plan_sub/plan_sub.repositoy";  
import { miembroGrupoRepo } from "../miembro_grupo/miembro_grupo.repository";
import { userRepo } from "../users/user.repository";
import { grupoRepo } from "../grupo/grupo.repository";
import { createAlerta } from "../alertas/alertas.repository";

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
    const id_plataforma = Number(req.params.id_plataforma);
    if (Number.isNaN(id_plataforma)) {
      return res.status(400).json({ message: "id_plataforma inválido" });
    }

    // sacar usuario desde el JWT
    const jwtPayload = (req as any).jwt as { email: string };
    if (!jwtPayload?.email) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const user = await userRepo.findByEmail(jwtPayload.email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const planes = await planSubRepo.getActivePlansByPlatformId(
      id_plataforma,
      user.id_usuario
    );

    return res.json(planes);
  } catch (error: any) {
    console.error("Error obteniendo planes activos:", error);
    return res.status(500).json({
      message: "Error al obtener planes activos",
      error: error.message,
    });
  }
},

  async joinPlanGroup(req: Request, res: Response) {
    try {
      const id_plan = Number(req.params.id_plan);
      if (Number.isNaN(id_plan)) {
        return res.status(400).json({ message: "id_plan inválido" });
      }
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
      const yaMiembro = await miembroGrupoRepo.isUserInGroup(plan.id_grupo, id_usuario);
      if (yaMiembro) {
        return res.status(400).json({ message: "Ya eres miembro de este grupo" });
      }
      await miembroGrupoRepo.addMemberToGroup({ id_grupo: plan.id_grupo, id_usuario });

      // Lógica para alertas
      const grupo = await grupoRepo.findById(plan.id_grupo);
      const nombreGrupo = grupo?.nombre ?? `Grupo #${plan.id_grupo}`;

      await createAlerta({
        id_usuario,
        tipo: "ALTA_GRUPO",
        titulo: "Te has unido a un grupo",
        mensaje: `Te has unido correctamente al grupo "${nombreGrupo}".`,
        id_grupo: plan.id_grupo,
        id_plan: plan.id_plan,          
        metadata: {
          plataforma: plan.nombre_plataforma ?? null,  
        },
      });

      // aqui se podria añadir que le llegue una alerta tmb al jefe del grupo
      // si o que flaqui 

      if (grupo?.id_jefe) {
        await createAlerta({
          id_usuario: grupo.id_jefe,
          tipo: "NUEVO_MIEMBRO_GRUPO",
          titulo: "Nuevo miembro en tu grupo",
          mensaje: `${user.nombre} se ha unido a tu grupo "${nombreGrupo}".`,
          id_grupo: plan.id_grupo,
          id_plan: plan.id_plan,
          metadata: {
            id_usuario_nuevo: id_usuario,
            nombre_usuario_nuevo: user.nombre,
            plataforma: plan.nombre_plataforma ?? null,
          },
        });
      }
      
      // Recalcular miembros del grupo tras la nueva alta
      const miembrosGrupo = await miembroGrupoRepo.getMembersByGroup(plan.id_grupo);
      if (plan.nmiembros && miembrosGrupo.length >= plan.nmiembros && grupo?.id_jefe) {
      await createAlerta({
        id_usuario: grupo.id_jefe,
        tipo: "GRUPO_LLENO",
        titulo: "Tu grupo está completo",
        mensaje: `Tu grupo "${nombreGrupo}" ha alcanzado el número máximo de miembros (${plan.nmiembros}). Ya no se pueden unir más usuarios.`,
        id_grupo: plan.id_grupo,
        id_plan: plan.id_plan,
        metadata: {
          capacidad: plan.nmiembros,
          miembros_actuales: miembrosGrupo.length,
          },
        });
      }
      
      return res.status(201).json({ message: "Te has unido al grupo correctamente", id_grupo: plan.id_grupo });
    } catch (error: any) {
      return res.status(500).json({ message: "Error al unirse al grupo", error: error.message });
    }
  },
};
