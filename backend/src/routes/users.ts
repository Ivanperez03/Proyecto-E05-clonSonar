import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db';

const r = Router();

r.post('/', async (req, res) => {
  try {
    const { nombre, apellidos, email, telefono, password } = req.body;
    if (!nombre || !email || !telefono || !password)
      return res.status(400).json({ message: 'Faltan campos' });

    const dup = await db.query('SELECT 1 FROM usuarios WHERE mail=$1 OR telefono=$2', [email, telefono]);
    if (dup.rowCount) return res.status(409).json({ message: 'Email o teléfono ya existe' });

    const hash = await bcrypt.hash(password, 12);
    const q = `
      INSERT INTO usuarios (nombre, apellidos, mail, telefono, contrasena)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id_usuario, nombre, apellidos, mail, telefono, created_at`;
    const { rows } = await db.query(q, [nombre, apellidos ?? null, email, telefono, hash]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error registrando usuario' });
  }
});

export default r;
