import { Router } from 'express';
import { userRouter } from '../modules/users/user.router';
import { authRouter } from '../modules/auth/auth.router';

export const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

