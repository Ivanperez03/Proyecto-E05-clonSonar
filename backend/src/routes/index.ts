import { Application } from 'express';
import userRouter from '../modules/users/user.router';
// import authRouter from '../modules/auth/auth.router';

export function registerRoutes(app: Application) {
  app.use('/api/users', userRouter);
  // app.use('/api/auth', authRouter);
}
