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
        `INSERT INTO plan_sub (id_plataforma, precio_plan, fecha_vencimiento, id_grupo) 
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

  async getAll() {
    try {
      const { rows } = await db.query(
        `SELECT ps.id_plan AS id, 
                p.nombre AS plataforma, 
                ps.precio_plan AS precio,
                g.nombre AS grupo,
                u.nombre AS usuario
         FROM plan_sub ps
         JOIN plataforma p ON ps.id_plataforma = p.id_plataforma
         JOIN grupo g ON ps.id_grupo = g.id_grupo
         LEFT JOIN usuario u ON g.id_jefe = u.id_usuario
         ORDER BY ps.id_plan DESC`
      );
      return rows;
    } catch (error) {
      console.error("Error obteniendo las ofertas:", error);
      throw new Error("No se pudieron obtener las ofertas");
    }
  },

  async deleteById(id_plan: number) {
    try {
      await db.query('DELETE FROM plan_sub WHERE id_plan = $1', [id_plan]);
    } catch (error) {
      console.error("Error eliminando la oferta:", error);
      throw new Error("No se pudo eliminar la oferta");
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

  // ✅ Método temporal para que no tire error
  async getActiveSubscriptions(id_usuario: number) {
    return []; // devuelve un array vacío
  },
};
