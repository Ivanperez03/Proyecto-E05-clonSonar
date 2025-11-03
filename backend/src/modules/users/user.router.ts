import { Router } from 'express';
import { userController } from './user.controller';

const r = Router();
r.post('/', userController.register);     // POST /api/users
r.post('/login', userController.login);   // POST /api/users/login  (opcional)
export default r;
