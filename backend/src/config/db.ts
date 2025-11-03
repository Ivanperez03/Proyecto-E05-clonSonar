import { Pool } from 'pg';
import { ENV } from './env';

export const db = new Pool({ connectionString: ENV.DATABASE_URL });

export async function testDB() {
  const res = await db.query('SELECT NOW() AS now');
  console.log('[DB] Conectado a Postgres. Hora del servidor:', res.rows[0].now);
}
