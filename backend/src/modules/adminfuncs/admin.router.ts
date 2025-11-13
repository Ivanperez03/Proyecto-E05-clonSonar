import { Router } from 'express';
import { AdminController } from './admin.controller';

const router = Router();

// ==== USUARIOS ====
router.get('/usuarios', AdminController.getUsuarios);
router.delete('/usuarios/:id', AdminController.eliminarUsuario);
router.post('/usuarios/:id/promover', AdminController.promoverUsuario);

// ==== GRUPOS ====
router.get('/grupos', AdminController.getGrupos);
router.delete('/grupos/:id', AdminController.eliminarGrupo);

// ==== OFERTAS ====
router.get('/ofertas', AdminController.getOfertas);
router.delete('/ofertas/:id', AdminController.eliminarOferta);

export default router;
