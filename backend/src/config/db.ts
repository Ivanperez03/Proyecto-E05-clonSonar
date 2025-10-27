import { Pool } from 'pg';
import { ENV } from './env';

if (!ENV.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida');
}

export const db = new Pool({
  connectionString: ENV.DATABASE_URL
});

// test rápido de conexión que llamaremos al arrancar
export async function testDB() {
  const res = await db.query('SELECT NOW() AS now');
  console.log('[DB] Conectado a Postgres. Hora del servidor:', res.rows[0].now);
}

