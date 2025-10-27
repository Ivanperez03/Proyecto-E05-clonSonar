import { Request, Response, NextFunction } from 'express';
import { getAllUsers } from './user.service';

export async function getUsersController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}


