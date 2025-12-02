import bcrypt from 'bcryptjs';
import { userRepo } from './user.repository';

export const userService = {
  async register(dto: { 
    nombre: string; 
    email: string; 
    telefono: string; 
    password: string; 
    admin?: boolean; 
  }) {
    if (await userRepo.existsByEmailOrPhone(dto.email, dto.telefono))
      throw new Error('Email o teléfono ya existe');

    const hash = await bcrypt.hash(dto.password, 12);

    // Definimos rol según el checkbox de admin
    const rol = dto.admin ? 'admin' : 'normal';

    return userRepo.insert({
      nombre: dto.nombre,
      email: dto.email,
      telefono: dto.telefono,
      hash,
      tipo: rol, // guardamos rol en la base de datos
    });
  },

  async login(email: string, password: string) {
    const u = await userRepo.findByEmail(email);
    if (!u?.contrasena) throw new Error("Credenciales inválidas");

    const ok = await bcrypt.compare(password, u.contrasena);
    if (!ok) throw new Error("Credenciales inválidas");

    const { contrasena, ...safe } = u;
    return safe; // devolvemos los datos del usuario sin contraseña
  },
};
