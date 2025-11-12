import { db } from '../../config/db';

export const planSubRepo = {
  async createSubscription({
    id_grupo, 
    id_plataforma, 
    precio, 
    fecha_vencimiento,
  }: {
    id_grupo: number;
    id_plataforma: number;
    precio: number;
    fecha_vencimiento: Date;
  }) {
    try {
      const { rows } = await db.query(
        `INSERT INTO plan_sub (id_plataforma, precio_plan, fecha_vencimiento,id_grupo) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [id_plataforma, precio, fecha_vencimiento, id_grupo]
      );
      return rows[0]; 
    } catch (error) {
      console.error("Error creando la suscripción:", error);
      throw new Error("No se pudo crear la suscripción");
    }
  },
  async getPlataformasByUserId(id_usuario: number) {
    try {
      const { rows } = await db.query(
        `SELECT p.nombre AS plataforma, ps.precio_plan, ps.fecha_vencimiento
         FROM plan_sub ps
         JOIN plataforma p ON ps.id_plataforma = p.id_plataforma
         JOIN miembro_grupo mg ON ps.id_grupo = mg.id_grupo
         WHERE mg.id_usuario = $1`, 
        [id_usuario]
      );
      return rows;
    } catch (error) {
      console.error("Error obteniendo las plataformas:", error);
      throw new Error("No se pudieron obtener las plataformas");
    }
  },
};


