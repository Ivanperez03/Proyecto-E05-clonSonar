import { db } from "../../config/db";

export const carteraRepo = {
  // Obtener la cartera completa de un usuario (saldo + id_usuario)
  async findByUserId(id_usuario: number) {
    const { rows } = await db.query(
      `SELECT id_usuario, saldo
       FROM cartera
       WHERE id_usuario = $1`,
      [id_usuario]
    );
    return rows[0] ?? null;
  },

  // Actualizar el saldo de un usuario
  async updateSaldo(id_usuario: number, saldo: number) {
    try {
      const { rows } = await db.query(
        `UPDATE cartera 
         SET saldo = $1 
         WHERE id_usuario = $2 
         RETURNING id_usuario, saldo`,
        [saldo, id_usuario]
      );
      if (!rows[0]) throw new Error("La cartera no existe para este usuario");
      return rows[0];
    } catch (error) {
      console.error("Error actualizando el saldo:", error);
      throw new Error("No se pudo actualizar el saldo");
    }
  },

  // Crear una cartera nueva (si no existe)
  async createCartera(id_usuario: number) {
    try {
      const { rows } = await db.query(
        `INSERT INTO cartera (id_usuario, saldo)
         VALUES ($1, 0)
         RETURNING id_usuario, saldo`,
        [id_usuario]
      );
      return rows[0];
    } catch (error) {
      console.error("Error creando la cartera:", error);
      throw new Error("No se pudo crear la cartera");
    }
  },

  // Añadir saldo y devolver resultado
  async addSaldo(id_usuario: number, monto: number) {
    try {
      const { rows } = await db.query(
        `UPDATE cartera 
         SET saldo = saldo + $1
         WHERE id_usuario = $2
         RETURNING id_usuario, saldo`,
        [monto, id_usuario]
      );
      return rows[0] ?? null;
    } catch (error) {
      console.error("Error añadiendo saldo:", error);
      throw new Error("No se pudo añadir saldo");
    }
  },

  // Restar saldo y devolver resultado
  async subtractSaldo(id_usuario: number, monto: number) {
    try {
      const { rows } = await db.query(
        `UPDATE cartera 
         SET saldo = saldo - $1
         WHERE id_usuario = $2 AND saldo >= $1
         RETURNING id_usuario, saldo`,
        [monto, id_usuario]
      );
      return rows[0] ?? null; // null si no tenía saldo suficiente
    } catch (error) {
      console.error("Error restando saldo:", error);
      throw new Error("No se pudo restar saldo");
    }
  },
};
