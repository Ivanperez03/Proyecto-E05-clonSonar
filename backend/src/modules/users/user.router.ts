import { Router } from 'express';
import { userController } from './user.controller';
import { verifyToken } from "../../middleware/auth.middleware";
const r = Router();
r.post('/', userController.register);     // POST /api/users
r.post('/login', userController.login);   // POST /api/users/login  

r.get("/me", verifyToken, (req, res) => {
  res.json({ user: (req as any).user });
});
export default r;
