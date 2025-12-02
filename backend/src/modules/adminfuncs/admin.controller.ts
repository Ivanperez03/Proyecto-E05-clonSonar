import { userRepo } from '../users/user.repository';
import { grupoRepo } from '../grupo/grupo.repository';
import { Request, Response } from "express";
import { planSubRepo } from '../plan_sub/plan_sub.repositoy';

export const AdminController = {
  async getUsuarios(req: Request, res: Response) {
    const usuarios = await userRepo.getAll();
    console.log('Usuarios obtenidos:', usuarios); 
    res.json(usuarios);
  },

  async eliminarUsuario(req: Request, res: Response) {
    await userRepo.deleteById(req.params.id);
    res.status(204).send();
  },

  async promoverUsuario(req: Request, res: Response) {
    await userRepo.promoteToAdmin(req.params.id);
    res.json({ message: 'Usuario promovido a admin' });
  },

  async getGrupos(req: Request, res: Response) {
    const grupos = await grupoRepo.getAllGroups();
    res.json(grupos);
  },

  async eliminarGrupo(req: Request, res: Response) {
    await grupoRepo.deleteById(req.params.id);
    res.status(204).send();
  },
  
  async getOfertas(req: Request, res: Response) {
    const ofertas = await planSubRepo.getAll();
    res.json(ofertas);
  },

  async eliminarOferta(req: Request, res: Response) {
    await planSubRepo.deleteById(Number(req.params.id));
    res.status(204).send();
  },
};
