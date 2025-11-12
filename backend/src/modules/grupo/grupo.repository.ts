import { db } from '../../config/db';

export const grupoRepo = {
  // Crear un grupo en la base de datos
  async createGroup({
    nombre,
    id_jefe,
  }: {
    nombre: string;
    id_jefe: number;
  }) {
    try {
      const { rows } = await db.query(
        `INSERT INTO grupo (nombre, fecha_creacion, estado, id_jefe) 
        VALUES ($1, CURRENT_DATE, 'abierto', $2) 
        RETURNING *`,
        [nombre, id_jefe]
      );
      return rows[0];  
    } catch (error) {
      console.error("Error creando el grupo:", error);
      throw new Error("No se pudo crear el grupo");
    }
  },

  async getAllGroups() {
    try {
      const { rows } = await db.query("SELECT * FROM grupo");
      return rows;
    } catch (error) {
      console.error("Error obteniendo los grupos:", error);
      throw new Error("No se pudieron obtener los grupos");
    }
  },

  async findById(id_grupo: number) {
    const { rows } = await db.query("SELECT * FROM grupo WHERE id_grupo = $1", [id_grupo]);
    return rows[0];  // Devuelve el grupo o null si no existe
  },
};
