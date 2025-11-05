import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { registerRoutes } from './routes';

const app = express();

// Configurar CORS con cookies
app.use(
  cors({
    origin: "http://localhost:3000", // Cambia según tu frontend
    credentials: true,               // Permite envío de cookies
  })
);

// Middleware para leer JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Registrar tus rutas
registerRoutes(app);

export default app;
