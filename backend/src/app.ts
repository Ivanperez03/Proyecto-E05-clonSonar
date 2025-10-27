import express from 'express';
import cors from 'cors';
import { router } from './routes/index';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales bajo /api
app.use('/api', router);

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Middleware de errores (ultimo si o si )
app.use(errorHandler);