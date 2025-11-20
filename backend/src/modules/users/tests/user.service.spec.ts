import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { userService } from "../user.service";
import { userRepo } from "../user.repository";

vi.mock("../user.repository", () => ({
  userRepo: {
    existsByEmailOrPhone: vi.fn(),
    insert: vi.fn(),
    findByEmail: vi.fn(),
  },
}));

describe("userService.register", () => {
  const baseUser = {
    nombre: "Pedro",
    email: "pedrito@test.com",
    telefono: "600000000",
    password: "secreta",
    tipo: "normal"
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crea usuario si email y teléfono no existen", async () => {
    // devuelve null si no existe usuario
    (userRepo.existsByEmailOrPhone as any).mockResolvedValue(null);
    // create devuelve el usuario insertado
    (userRepo.insert as any).mockResolvedValue({
      id_usuario: 1,
      nombre: baseUser.nombre,
      mail: baseUser.email,
      telefono: baseUser.telefono,
    });
    const u = await userService.register(baseUser);
    expect(userRepo.existsByEmailOrPhone).toHaveBeenCalledWith(
      baseUser.email,
      baseUser.telefono
    );
    expect(userRepo.insert).toHaveBeenCalled();
    expect(u).toMatchObject({
      id_usuario: 1,
      nombre: baseUser.nombre,
      mail: baseUser.email,
    });
  });

  it("lanza error si email o teléfono ya existe", async () => {
    // Ahora simulamos que ya existe un usuario
    (userRepo.existsByEmailOrPhone as any).mockResolvedValue({
      id_usuario: 10,
    });

    await expect(userService.register(baseUser)).rejects.toThrow(
      "Email o teléfono ya existe"
    );
  });
});


describe("userService.login", () => {
  const email = "pedrito@test.com";
  const password = "secreta";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve el usuario sin contraseña si las credenciales son correctas", async () => {
    // Creamos un hash válido para la contraseña "secreta"
    const hash = await bcrypt.hash(password, 10);

    // El repo devuelve un usuario con ese hash
    (userRepo.findByEmail as any).mockResolvedValue({
      id_usuario: 1,
      nombre: "Pedro",
      mail: email,
      telefono: "600000000",
      contrasena: hash,
      tipo: "normal",
    });

    const result = await userService.login(email, password);

    expect(userRepo.findByEmail).toHaveBeenCalledWith(email);
    // Comprobamos que devuelve los datos esperados
    expect(result).toMatchObject({
      id_usuario: 1,
      nombre: "Pedro",
      mail: email,
      telefono: "600000000",
      tipo: "normal",
    });
    // Y que NO viene la contraseña
    expect((result as any).contrasena).toBeUndefined();
  });

  it("lanza error si el usuario no existe", async () => {
    (userRepo.findByEmail as any).mockResolvedValue(null);

    await expect(userService.login(email, password)).rejects.toThrow(
      "Credenciales inválidas"
    );
  });

  it("lanza error si la contraseña es incorrecta", async () => {
    // Hash de otra contraseña distinta
    const hash = await bcrypt.hash("otra-cosa", 10);

    (userRepo.findByEmail as any).mockResolvedValue({
      id_usuario: 1,
      nombre: "Pedro",
      mail: email,
      telefono: "600000000",
      contrasena: hash,
      tipo: "normal",
    });

    await expect(userService.login(email, password)).rejects.toThrow(
      "Credenciales inválidas"
    );
  });
});
