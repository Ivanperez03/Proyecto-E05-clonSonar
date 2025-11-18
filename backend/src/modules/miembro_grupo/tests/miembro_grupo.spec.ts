import { describe, it, expect, vi, beforeEach } from "vitest";
import { miembroGrupoController } from "../miembro_grupo.controller";
import { miembroGrupoRepo } from "../miembro_grupo.repository";

vi.mock("../miembro_grupo.repository", () => ({
  miembroGrupoRepo: {
    addMemberToGroup: vi.fn(),
    getMembersByGroup: vi.fn(),
    removeMemberFromGroup: vi.fn(),
  },
}));

describe("miembroGrupoController", () => {
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

  // addMember

  it("addMember devuelve 400 si faltan campos", async () => {
    req.body = { id_grupo: 1 }; // falta id_usuario

    await miembroGrupoController.addMember(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Faltan campos" })
    );
    expect(miembroGrupoRepo.addMemberToGroup).not.toHaveBeenCalled();
  });

  it("addMember devuelve 201 y el miembro creado si todo va bien", async () => {
    req.body = { id_grupo: 2, id_usuario: 5 };

    const fakeMember = {
      id_grupo: 2,
      id_usuario: 5,
      fecha_ingreso: "2025-11-18T00:00:00.000Z",
    };

    (miembroGrupoRepo.addMemberToGroup as any).mockResolvedValue(fakeMember);

    await miembroGrupoController.addMember(req, res);

    expect(miembroGrupoRepo.addMemberToGroup).toHaveBeenCalledWith({
      id_grupo: 2,
      id_usuario: 5,
    });
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      message: "Miembro agregado con éxito",
      member: fakeMember,
    });
  });

  it("addMember devuelve 500 si el repo lanza error", async () => {
    req.body = { id_grupo: 2, id_usuario: 5 };

    (miembroGrupoRepo.addMemberToGroup as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await miembroGrupoController.addMember(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al agregar miembro",
      })
    );
  });

  // getMembers

  it("getMembers devuelve la lista de miembros del grupo", async () => {
    req.params = { id_grupo: "3" };

    const fakeMembers = [
      { id_usuario: 1, nombre: "Pedro", mail: "p@test.com" },
      { id_usuario: 2, nombre: "Ana", mail: "a@test.com" },
    ];

    (miembroGrupoRepo.getMembersByGroup as any).mockResolvedValue(fakeMembers);

    await miembroGrupoController.getMembers(req, res);

    expect(miembroGrupoRepo.getMembersByGroup).toHaveBeenCalledWith(3);
    expect(json).toHaveBeenCalledWith(fakeMembers);
  });

  it("getMembers devuelve 500 si el repo lanza error", async () => {
    req.params = { id_grupo: "3" };

    (miembroGrupoRepo.getMembersByGroup as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await miembroGrupoController.getMembers(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al obtener miembros",
      })
    );
  });

  // removeMember

  it("removeMember devuelve 200 y el miembro eliminado si todo va bien", async () => {
    req.body = { id_grupo: 3, id_usuario: 7 };

    const fakeDeleted = {
      id_grupo: 3,
      id_usuario: 7,
      fecha_ingreso: "2025-01-01T00:00:00.000Z",
    };

    (miembroGrupoRepo.removeMemberFromGroup as any).mockResolvedValue(
      fakeDeleted
    );

    await miembroGrupoController.removeMember(req, res);

    expect(miembroGrupoRepo.removeMemberFromGroup).toHaveBeenCalledWith({
      id_grupo: 3,
      id_usuario: 7,
    });
    // no llamas a status(), así que por defecto sería 200
    expect(json).toHaveBeenCalledWith({
      message: "Miembro eliminado con éxito",
      member: fakeDeleted,
    });
  });

  it("removeMember devuelve 500 si el repo lanza error", async () => {
    req.body = { id_grupo: 3, id_usuario: 7 };

    (miembroGrupoRepo.removeMemberFromGroup as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await miembroGrupoController.removeMember(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al eliminar miembro",
      })
    );
  });
});
