import { Router } from 'express';
import { getUsersController } from './user.controller';

export const userRouter = Router();

userRouter.get('/', getUsersController);

