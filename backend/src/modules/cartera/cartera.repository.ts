import { db } from "../../config/db";  

export const carteraRepo = {
  // Obtener el saldo de un usuario
  async getSaldoByUserId(id_usuario: number) {
    try {
      const { rows } = await db.query(
        "SELECT saldo FROM cartera WHERE id_usuario = $1",
        [id_usuario]
      );
      return rows[0] ? rows[0].saldo : null;  // Si no existe, retorna null
    } catch (error) {
      console.error("Error obteniendo el saldo:", error);
      throw new Error("No se pudo obtener el saldo");
    }
  },
  // Actualizar el saldo de un usuario
  async updateSaldo(id_usuario: number, saldo: number) {
    try {
      const { rows } = await db.query(
        "UPDATE cartera SET saldo = $1 WHERE id_usuario = $2 RETURNING *",
        [saldo, id_usuario]
      );
      return rows[0];  // Devuelve la fila actualizada
    } catch (error) {
      console.error("Error actualizando el saldo:", error);
      throw new Error("No se pudo actualizar el saldo");
    }
  },
  // Crear una nueva cartera para un usuario (si no existe)
  async createCartera(id_usuario: number) {
    try {
      const { rows } = await db.query(
        "INSERT INTO cartera (id_usuario, saldo) VALUES ($1, 0) RETURNING *",
        [id_usuario]
      );
      return rows[0];  // Devuelve la cartera creada con saldo 0
    } catch (error) {
      console.error("Error creando la cartera:", error);
      throw new Error("No se pudo crear la cartera");
    }
  },
};
