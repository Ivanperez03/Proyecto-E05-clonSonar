import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import routes from "./routes";

const app = express();

// Configurar CORS con cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Cambia según tu frontend
    credentials: true,               // Permite envío de cookies
  })
);

// Middleware para leer JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Registrar tus rutas
app.use("/api", routes); // 🔹 esto genera /api/users/me

export default app;
