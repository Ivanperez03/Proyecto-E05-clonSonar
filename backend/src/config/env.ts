import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ?? '3000',
  JWT_SECRET: process.env.JWT_SECRET || "secreto_temporal",
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development'
};

if (!ENV.DATABASE_URL) {
  console.warn('[WARN] DATABASE_URL no está definida');
}
