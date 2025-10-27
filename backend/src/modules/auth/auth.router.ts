import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/login', (_req, res) => {
  // TODO: login real más adelante (JWT, etc.)
  res.json({ message: 'login no implementado aún' });
});

