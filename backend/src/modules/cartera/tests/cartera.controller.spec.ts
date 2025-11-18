import { describe, it, expect, vi, beforeEach } from "vitest";
import { carteraController } from "../cartera.controller";
import { carteraRepo } from "../cartera.repository";

vi.mock("../cartera.repository", () => ({
  carteraRepo: {
    findByUserId: vi.fn(),
    updateSaldo: vi.fn(),
    createCartera: vi.fn(),
  },
}));

describe("carteraController", () => {
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

  // getSaldo

  it("getSaldo devuelve 404 si la cartera no existe", async () => {
    req.params = { id_usuario: "10" };

    (carteraRepo.findByUserId as any).mockResolvedValue(null);

    await carteraController.getSaldo(req, res);

    expect(carteraRepo.findByUserId).toHaveBeenCalledWith(10);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Cartera no encontrada para el usuario",
      })
    );
  });

  it("getSaldo devuelve el saldo si existe", async () => {
    req.params = { id_usuario: "10" };

    (carteraRepo.findByUserId as any).mockResolvedValue(42.5);

    await carteraController.getSaldo(req, res);

    expect(carteraRepo.findByUserId).toHaveBeenCalledWith(10);
    expect(json).toHaveBeenCalledWith({ saldo: 42.5 });
  });

  it("getSaldo devuelve 500 si el repo lanza error", async () => {
    req.params = { id_usuario: "10" };

    (carteraRepo.findByUserId as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await carteraController.getSaldo(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al obtener el saldo",
      })
    );
  });

  // updateSaldo

  it("updateSaldo devuelve 400 si el saldo es negativo", async () => {
    req.params = { id_usuario: "10" };
    req.body = { saldo: -5 };

    await carteraController.updateSaldo(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "El saldo no puede ser negativo",
      })
    );
    expect(carteraRepo.updateSaldo).not.toHaveBeenCalled();
  });

  it("updateSaldo actualiza el saldo y devuelve la cartera", async () => {
    req.params = { id_usuario: "10" };
    req.body = { saldo: 100 };

    const fakeCartera = {
      id_usuario: 10,
      saldo: 100,
    };

    (carteraRepo.updateSaldo as any).mockResolvedValue(fakeCartera);

    await carteraController.updateSaldo(req, res);

    expect(carteraRepo.updateSaldo).toHaveBeenCalledWith(10, 100);
    expect(json).toHaveBeenCalledWith({
      message: "Saldo actualizado correctamente",
      updatedCartera: fakeCartera,
    });
  });

  it("updateSaldo devuelve 500 si el repo lanza error", async () => {
    req.params = { id_usuario: "10" };
    req.body = { saldo: 100 };

    (carteraRepo.updateSaldo as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await carteraController.updateSaldo(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al actualizar el saldo",
      })
    );
  });

  // createCartera

  it("createCartera crea una cartera y devuelve 201", async () => {
    req.body = { id_usuario: 10 };

    const fakeCartera = { id_usuario: 10, saldo: 0 };

    (carteraRepo.createCartera as any).mockResolvedValue(fakeCartera);

    await carteraController.createCartera(req, res);

    expect(carteraRepo.createCartera).toHaveBeenCalledWith(10);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      message: "Cartera creada con éxito",
      cartera: fakeCartera,
    });
  });

  it("createCartera devuelve 500 si el repo lanza error", async () => {
    req.body = { id_usuario: 10 };

    (carteraRepo.createCartera as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await carteraController.createCartera(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al crear la cartera",
      })
    );
  });
});
