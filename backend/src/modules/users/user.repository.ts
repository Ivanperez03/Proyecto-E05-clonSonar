import { db } from '../../config/db';

export type UserRow = {
  id_usuario: number;
  nombre: string;
  mail: string;
  telefono: string;
  contrasena?: string;
  tipo:string;
};

export const userRepo = {
  async existsByEmailOrPhone(email: string, tel: string) {
    const r = await db.query('SELECT 1 FROM usuario WHERE mail=$1 OR telefono=$2', [email, tel]);
    return r.rowCount! > 0;
  },

  async insert(p: { nombre: string; email: string; telefono: string; hash: string; tipo: string; }) {
    const q = `
      INSERT INTO usuario (nombre, mail, telefono, contrasena)
      VALUES ($1,$2,$3,$4)
      RETURNING id_usuario, nombre, mail, telefono`;
    const { rows } = await db.query(q, [p.nombre, p.email, p.telefono, p.hash]);
    return rows[0] as UserRow;
  },

  async findByEmail(email: string) {
    const { rows } = await db.query<UserRow & { contrasena: string }>(
      "SELECT id_usuario, nombre, mail, telefono, contrasena,tipo FROM usuario WHERE LOWER(mail)=LOWER($1)",
      [email]
    );
    return rows[0] ?? null;
  },
  getAll: async () => {
    const { rows } = await db.query('SELECT id_usuario, nombre, mail, telefono, tipo FROM usuario');
    
    return rows;
  },  
  async promoteToAdmin(id: string) {
    await db.query('UPDATE usuario SET rol=$1 WHERE id_usuario=$2', ['admin', id]);
  },
  async deleteById(id: string) {
    await db.query('DELETE FROM usuario WHERE id_usuario=$1', [id]);
  },
};