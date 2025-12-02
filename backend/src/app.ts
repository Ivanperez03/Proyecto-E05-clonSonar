import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import routes from "./routes";

const app = express();

// Configurar CORS con cookies
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,               // Permite envío de cookies
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes); 

export default app;
