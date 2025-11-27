import { db } from '../../config/db';

export const planSubRepo = {
  async createSubscription({
    id_grupo, 
    id_plataforma, 
    precio, 
    fecha_vencimiento,
    nmiembros
  }: {
    id_grupo: number;
    id_plataforma: number;
    precio: number;
    fecha_vencimiento: Date;
    nmiembros: number;
  }) {
    try {
      const { rows } = await db.query(
        `INSERT INTO plan_sub (id_plataforma, precio_plan, fecha_vencimiento, id_grupo, nmiembros) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [id_plataforma, precio, fecha_vencimiento, id_grupo, nmiembros]
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
async getActiveSubscriptionsByUserId(id_usuario: number) {
  const { rows } = await db.query(
    `
    SELECT
      ps.id_plan,
      ps.precio_plan,
      ps.fecha_vencimiento,
      ps.nmiembros                    AS capacidad_total,
      ps.fecha_inicio_cobro,          -- ⬅️ nuevo
      g.id_grupo,
      g.nombre                        AS nombre_grupo,
      p.id_plataforma,
      p.nombre                        AS plataforma,

      COUNT(mg2.id_usuario)           AS miembros_actuales,
      ROUND(ps.precio_plan::numeric / COUNT(mg2.id_usuario), 2) AS precio_por_usuario
    FROM miembro_grupo mg
    JOIN grupo g       ON g.id_grupo       = mg.id_grupo
    JOIN plan_sub ps   ON ps.id_grupo      = g.id_grupo
    JOIN plataforma p  ON p.id_plataforma  = ps.id_plataforma
    LEFT JOIN miembro_grupo mg2 ON mg2.id_grupo = g.id_grupo
    WHERE mg.id_usuario = $1
      AND ps.fecha_vencimiento >= NOW()
    GROUP BY
      ps.id_plan,
      ps.precio_plan,
      ps.fecha_vencimiento,
      ps.nmiembros,
      ps.fecha_inicio_cobro,
      g.id_grupo,
      g.nombre,
      p.id_plataforma,
      p.nombre
    ORDER BY ps.fecha_vencimiento;
    `,
    [id_usuario]
  );

  return rows;
}

,

  async getActivePlansByPlatformId(
  id_plataforma: number,
  id_usuario: number
) {
  try {
    const { rows } = await db.query(
      `
      SELECT
        ps.id_plan                        AS id_plan,
        ps.precio_plan                    AS precio_total_mensual,
        ps.nmiembros                      AS capacidad_total,
        ps.fecha_vencimiento              AS fecha_vencimiento,
        g.id_grupo                        AS id_grupo,
        g.nombre                          AS nombre_grupo,

        COALESCE(COUNT(mg.id_usuario), 0) AS miembros_actuales,

        CASE
          WHEN COUNT(mg.id_usuario) = 0
            THEN ps.precio_plan
          ELSE ps.precio_plan / (COUNT(mg.id_usuario) + 1)
        END                               AS precio_por_usuario
      FROM plan_sub ps
      JOIN grupo g
        ON g.id_grupo = ps.id_grupo
      LEFT JOIN miembro_grupo mg               -- para contar miembros
        ON mg.id_grupo = g.id_grupo
      LEFT JOIN miembro_grupo mgu              -- para saber si ESTE usuario ya está dentro
        ON mgu.id_grupo = g.id_grupo
       AND mgu.id_usuario = $2
      WHERE ps.id_plataforma = $1
        AND ps.fecha_vencimiento >= NOW()
        AND g.estado = 'abierto'
        AND mgu.id_usuario IS NULL            -- ❌ excluir grupos donde ya es miembro
      GROUP BY
        ps.id_plan,
        ps.precio_plan,
        ps.nmiembros,
        ps.fecha_vencimiento,
        g.id_grupo,
        g.nombre
      HAVING COUNT(mg.id_usuario) < ps.nmiembros   -- ❌ excluir grupos llenos
      ORDER BY precio_por_usuario ASC;
      `,
      [id_plataforma, id_usuario]
    );

    return rows;
  } catch (error) {
    console.error("Error obteniendo planes activos:", error);
    throw new Error("No se pudieron obtener los planes activos");
  }
}

,
  // obtener un plan concreto (para el "unirme")
  async getPlanById(id_plan: number) {
    try {
      const { rows } = await db.query(
        `SELECT
           ps.*,
           g.id_grupo,
           g.estado AS estado_grupo
         FROM plan_sub ps
         JOIN grupo g ON g.id_grupo = ps.id_grupo
         WHERE ps.id_plan = $1`,
        [id_plan]
      );
      return rows[0] ?? null;
    } catch (error) {
      console.error("Error obteniendo el plan:", error);
      throw new Error("No se pudo obtener el plan");
    }
  },

  async getAllActivePlans() {
  const { rows } = await db.query(
    `
    SELECT
      ps.id_plan,
      ps.id_grupo,
      ps.id_plataforma,
      ps.precio_plan,
      ps.fecha_vencimiento,
      ps.nmiembros,
      g.fecha_creacion AS fecha_inicio_cobro
    FROM plan_sub ps
    JOIN grupo g ON g.id_grupo = ps.id_grupo
    WHERE ps.fecha_vencimiento >= NOW()
      AND g.estado = 'abierto'
    `
  );

  return rows;
}

};