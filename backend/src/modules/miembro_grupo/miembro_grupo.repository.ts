import { db } from '../../config/db';

export const miembroGrupoRepo = {
  async addMemberToGroup({
    id_grupo,
    id_usuario,
  }: {
    id_grupo: number;
    id_usuario: number;
  }) {
    try {
      const { rows } = await db.query(
        `INSERT INTO miembro_grupo (id_grupo, id_usuario, fecha_ingreso) 
         VALUES ($1, $2, CURRENT_DATE) 
         RETURNING *`,
        [id_grupo, id_usuario]
      );
      return rows[0];  
    } catch (error) {
      console.error("Error agregando miembro al grupo:", error);
      throw new Error("No se pudo agregar el miembro al grupo");
    }
  },
  // Obtener todos los miembros de un grupo
  async getMembersByGroup(id_grupo: number) {
    try {
      const { rows } = await db.query(
        `SELECT u.id_usuario, u.nombre, u.mail, mg.fecha_ingreso 
         FROM usuario u 
         JOIN miembro_grupo mg ON u.id_usuario = mg.id_usuario
         WHERE mg.id_grupo = $1`,
        [id_grupo]
      );
      return rows;
    } catch (error) {
      console.error("Error obteniendo los miembros del grupo:", error);
      throw new Error("No se pudieron obtener los miembros del grupo");
    }
  },
  // Eliminar un miembro de un grupo
  async removeMemberFromGroup({
    id_grupo,
    id_usuario,
  }: {
    id_grupo: number;
    id_usuario: number;
  }) {
    try {
      const { rows } = await db.query(
        `DELETE FROM miembro_grupo 
         WHERE id_grupo = $1 AND id_usuario = $2 
         RETURNING *`,
        [id_grupo, id_usuario]
      );
      return rows[0]; 
    } catch (error) {
      console.error("Error eliminando miembro del grupo:", error);
      throw new Error("No se pudo eliminar el miembro del grupo");
    }
  },
  async getMembersByUserId(id_usuario: number) {
    try {
      const { rows } = await db.query(
        `SELECT g.nombre AS grupo, mg.fecha_ingreso 
         FROM grupo g
         JOIN miembro_grupo mg ON g.id_grupo = mg.id_grupo
         WHERE mg.id_usuario = $1`, 
        [id_usuario]
      );
      return rows;
    } catch (error) {
      console.error("Error obteniendo los grupos:", error);
      throw new Error("No se pudieron obtener los grupos");
    }
  },
};
