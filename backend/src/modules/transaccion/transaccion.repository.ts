import { db } from "../../config/db";

export const transaccionRepo = {
  async create({
    id_plan_sub,
    id_usuario_origen,
    id_usuario_final,
    precio,
    comision = 0,
  }: {
    id_plan_sub: number;
    id_usuario_origen: number;
    id_usuario_final: number;
    precio: number;
    comision?: number;
  }) {
    const { rows } = await db.query(
      `
      INSERT INTO transaccion (
        id_plan_sub,
        id_usuario_origen,
        id_usuario_final,
        precio,
        comision,
        fecha_trans
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
      `,
      [id_plan_sub, id_usuario_origen, id_usuario_final, precio, comision]
    );

    return rows[0];
  },

  async getLastByPlanId(id_plan_sub: number) {
    const { rows } = await db.query(
      `
      SELECT *
      FROM transaccion
      WHERE id_plan_sub = $1
      ORDER BY fecha_trans DESC
      LIMIT 1
      `,
      [id_plan_sub]
    );

    return rows[0] ?? null;
  },
};
