import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { registerRoutes } from './routes';

const app = express();
app.use(cors({ origin: ENV.WEB_ORIGIN, credentials: true }));
app.use(express.json());

registerRoutes(app);

export default app;
