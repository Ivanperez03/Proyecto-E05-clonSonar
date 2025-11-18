import { describe, it, expect, vi, beforeEach } from "vitest";
import { grupoController } from "../grupo.controller";
import { grupoRepo } from "../grupo.repository";
import { miembroGrupoRepo } from "../../miembro_grupo/miembro_grupo.repository";
import { userRepo } from "../../users/user.repository";

vi.mock("../grupo.repository", () => ({
  grupoRepo: {
    createGroup: vi.fn(),
    getAllGroups: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock("../../miembro_grupo/miembro_grupo.repository", () => ({
  miembroGrupoRepo: {
    addMemberToGroup: vi.fn(),
  },
}));

vi.mock("../../users/user.repository", () => ({
  userRepo: {
    findByEmail: vi.fn(),
  },
}));

describe("grupoController", () => {
  let req: any;
  let res: any;
  let json: any;
  let status: any;

  beforeEach(() => {
    vi.clearAllMocks();

    json = vi.fn().mockReturnThis();
    status = vi.fn().mockReturnThis();

    res = { json, status } as any;
    req = {} as any;
  });

  // createGroup

  it("createGroup devuelve 401 si no hay JWT", async () => {
    req.jwt = undefined;
    req.body = { nombre: "Mi grupo" };

    await grupoController.createGroup(req, res);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "No autorizado" })
    );
    expect(userRepo.findByEmail).not.toHaveBeenCalled();
  });

  it("createGroup devuelve 404 si el usuario (jefe) no existe", async () => {
    req.jwt = { email: "jefe@test.com" };
    req.body = { nombre: "Mi grupo" };

    (userRepo.findByEmail as any).mockResolvedValue(null);

    await grupoController.createGroup(req, res);

    expect(userRepo.findByEmail).toHaveBeenCalledWith("jefe@test.com");
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Usuario no encontrado" })
    );
  });

  it("createGroup devuelve 400 si falta el nombre del grupo", async () => {
    req.jwt = { email: "jefe@test.com" };
    req.body = {}; // sin nombre

    (userRepo.findByEmail as any).mockResolvedValue({
      id_usuario: 10,
      nombre: "Jefe",
      mail: "jefe@test.com",
    });

    await grupoController.createGroup(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Falta el nombre del grupo" })
    );
    expect(grupoRepo.createGroup).not.toHaveBeenCalled();
  });

  it("createGroup crea el grupo, añade al jefe y devuelve 201", async () => {
    req.jwt = { email: "jefe@test.com" };
    req.body = { nombre: "Grupo Netflix" };

    const fakeJefe = {
      id_usuario: 10,
      nombre: "Jefe",
      mail: "jefe@test.com",
    };

    const fakeGroup = {
      id_grupo: 5,
      nombre: "Grupo Netflix",
      fecha_creacion: "2025-11-18T00:00:00.000Z",
      estado: "abierto",
      id_jefe: 10,
    };

    (userRepo.findByEmail as any).mockResolvedValue(fakeJefe);
    (grupoRepo.createGroup as any).mockResolvedValue(fakeGroup);
    (miembroGrupoRepo.addMemberToGroup as any).mockResolvedValue({
      id_grupo: 5,
      id_usuario: 10,
      fecha_ingreso: "2025-11-18T00:00:00.000Z",
    });

    await grupoController.createGroup(req, res);

    expect(userRepo.findByEmail).toHaveBeenCalledWith("jefe@test.com");
    expect(grupoRepo.createGroup).toHaveBeenCalledWith({
      nombre: "Grupo Netflix",
      id_jefe: 10,
    });
    expect(miembroGrupoRepo.addMemberToGroup).toHaveBeenCalledWith({
      id_usuario: 10,
      id_grupo: 5,
    });
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      message: "Grupo creado con éxito",
      group: fakeGroup,
    });
  });

  it("createGroup devuelve 500 si algo rompe en el try", async () => {
    req.jwt = { email: "jefe@test.com" };
    req.body = { nombre: "Grupo Netflix" };

    (userRepo.findByEmail as any).mockRejectedValue(
      new Error("Fallo locura mal")
    );

    await grupoController.createGroup(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al crear el grupo",
      })
    );
  });

  // getAllGroups

  it("getAllGroups devuelve la lista de grupos", async () => {
    const fakeGroups = [
      { id_grupo: 1, nombre: "G1" },
      { id_grupo: 2, nombre: "G2" },
    ];

    (grupoRepo.getAllGroups as any).mockResolvedValue(fakeGroups);

    await grupoController.getAllGroups(req, res);

    expect(grupoRepo.getAllGroups).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(fakeGroups);
  });

  it("getAllGroups devuelve 500 si el repo falla", async () => {
    (grupoRepo.getAllGroups as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await grupoController.getAllGroups(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al obtener los grupos",
      })
    );
  });

  // getGroupById

  it("getGroupById devuelve el grupo si existe", async () => {
    req.params = { id_grupo: "7" };

    const fakeGroup = {
      id_grupo: 7,
      nombre: "Grupo Disney+",
    };

    (grupoRepo.findById as any).mockResolvedValue(fakeGroup);

    await grupoController.getGroupById(req, res);

    expect(grupoRepo.findById).toHaveBeenCalledWith(7);
    expect(json).toHaveBeenCalledWith(fakeGroup);
  });

  it("getGroupById devuelve 404 si el grupo no existe", async () => {
    req.params = { id_grupo: "7" };

    (grupoRepo.findById as any).mockResolvedValue(null);

    await grupoController.getGroupById(req, res);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Grupo no encontrado" })
    );
  });

  it("getGroupById devuelve 500 si el repo lanza error", async () => {
    req.params = { id_grupo: "7" };

    (grupoRepo.findById as any).mockRejectedValue(new Error("Fallo BD"));

    await grupoController.getGroupById(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al obtener el grupo",
      })
    );
  });
});
