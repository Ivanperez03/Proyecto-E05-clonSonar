import { describe, it, expect, vi, beforeEach } from "vitest";
import { carteraController } from "../cartera.controller";
import { carteraRepo } from "../cartera.repository";

vi.mock("../cartera.repository", () => ({
  carteraRepo: {
    findByUserId: vi.fn(),
    createCartera: vi.fn(),
    addSaldo: vi.fn(),
    subtractSaldo: vi.fn(),
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

  // ======================
  // getSaldo
  // ======================

  it("getSaldo devuelve 404 si la cartera no existe", async () => {
    req.params = { id_usuario: "10" };

    (carteraRepo.findByUserId as any).mockResolvedValue(null);

    await carteraController.getSaldo(req, res);

    expect(carteraRepo.findByUserId).toHaveBeenCalledWith(10);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Cartera no encontrada",
      })
    );
  });

  it("getSaldo devuelve la cartera si existe", async () => {
    req.params = { id_usuario: "10" };

    const fakeCartera = { id_usuario: 10, saldo: 42.5 };

    (carteraRepo.findByUserId as any).mockResolvedValue(fakeCartera);

    await carteraController.getSaldo(req, res);

    expect(carteraRepo.findByUserId).toHaveBeenCalledWith(10);
    expect(json).toHaveBeenCalledWith(fakeCartera);
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
        message: "Error al obtener saldo",
      })
    );
  });

  // ======================
  // createCartera
  // ======================

  it("createCartera crea una cartera y devuelve 201", async () => {
    req.body = { id_usuario: 10 };

    const fakeCartera = { id_usuario: 10, saldo: 0 };

    (carteraRepo.createCartera as any).mockResolvedValue(fakeCartera);

    await carteraController.createCartera(req, res);

    expect(carteraRepo.createCartera).toHaveBeenCalledWith(10);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      message: "Cartera creada",
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
        message: "Error creando cartera",
      })
    );
  });

  // ======================
  // recargarSaldo
  // ======================

  it("recargarSaldo devuelve 400 si la cantidad es inválida", async () => {
    req.params = { id_usuario: "10" };
    req.body = { cantidad: 0 };

    await carteraController.recargarSaldo(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Cantidad inválida",
      })
    );
    expect(carteraRepo.addSaldo).not.toHaveBeenCalled();
  });

  it("recargarSaldo crea la cartera si no existe y añade saldo", async () => {
    req.params = { id_usuario: "10" };
    req.body = { cantidad: 50 };

    (carteraRepo.findByUserId as any).mockResolvedValue(null);

    const createdCartera = { id_usuario: 10, saldo: 0 };
    (carteraRepo.createCartera as any).mockResolvedValue(createdCartera);

    const updatedCartera = { id_usuario: 10, saldo: 50 };
    (carteraRepo.addSaldo as any).mockResolvedValue(updatedCartera);

    await carteraController.recargarSaldo(req, res);

    expect(carteraRepo.findByUserId).toHaveBeenCalledWith(10);
    expect(carteraRepo.createCartera).toHaveBeenCalledWith(10);
    expect(carteraRepo.addSaldo).toHaveBeenCalledWith(10, 50);
    expect(json).toHaveBeenCalledWith({
      message: "Saldo añadido correctamente",
      saldo: 50,
    });
  });

  it("recargarSaldo añade saldo si la cartera ya existe", async () => {
    req.params = { id_usuario: "10" };
    req.body = { cantidad: 30 };

    const existingCartera = { id_usuario: 10, saldo: 20 };
    (carteraRepo.findByUserId as any).mockResolvedValue(existingCartera);

    const updatedCartera = { id_usuario: 10, saldo: 50 };
    (carteraRepo.addSaldo as any).mockResolvedValue(updatedCartera);

    await carteraController.recargarSaldo(req, res);

    expect(carteraRepo.findByUserId).toHaveBeenCalledWith(10);
    expect(carteraRepo.createCartera).not.toHaveBeenCalled();
    expect(carteraRepo.addSaldo).toHaveBeenCalledWith(10, 30);
    expect(json).toHaveBeenCalledWith({
      message: "Saldo añadido correctamente",
      saldo: 50,
    });
  });

  it("recargarSaldo devuelve 500 si el repo lanza error", async () => {
    req.params = { id_usuario: "10" };
    req.body = { cantidad: 20 };

    (carteraRepo.findByUserId as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await carteraController.recargarSaldo(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error añadiendo saldo",
      })
    );
  });

  // ======================
  // gastarSaldo
  // ======================

  it("gastarSaldo devuelve 400 si la cantidad es inválida", async () => {
    req.params = { id_usuario: "10" };
    req.body = { cantidad: -10 };

    await carteraController.gastarSaldo(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Cantidad inválida",
      })
    );
    expect(carteraRepo.subtractSaldo).not.toHaveBeenCalled();
  });

  it("gastarSaldo devuelve 400 si no hay saldo suficiente o la cartera no existe", async () => {
    req.params = { id_usuario: "10" };
    req.body = { cantidad: 50 };

    (carteraRepo.subtractSaldo as any).mockResolvedValue(null);

    await carteraController.gastarSaldo(req, res);

    expect(carteraRepo.subtractSaldo).toHaveBeenCalledWith(10, 50);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Saldo insuficiente o cartera inexistente",
      })
    );
  });

  it("gastarSaldo descuenta saldo y devuelve el saldo restante", async () => {
    req.params = { id_usuario: "10" };
    req.body = { cantidad: 30 };

    const updatedCartera = { id_usuario: 10, saldo: 70 };
    (carteraRepo.subtractSaldo as any).mockResolvedValue(updatedCartera);

    await carteraController.gastarSaldo(req, res);

    expect(carteraRepo.subtractSaldo).toHaveBeenCalledWith(10, 30);
    expect(json).toHaveBeenCalledWith({
      message: "Saldo descontado correctamente",
      saldo_restante: 70,
    });
  });

  it("gastarSaldo devuelve 500 si el repo lanza error", async () => {
    req.params = { id_usuario: "10" };
    req.body = { cantidad: 10 };

    (carteraRepo.subtractSaldo as any).mockRejectedValue(
      new Error("Fallo BD")
    );

    await carteraController.gastarSaldo(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error descontando saldo",
      })
    );
  });

  // ======================
  // transferirAlJefe
  // ======================

  it("transferirAlJefe transfiere el 85% de la cantidad total al jefe", async () => {
    const addSaldoMock = carteraRepo.addSaldo as any;
    addSaldoMock.mockResolvedValue({ id_usuario: 1, saldo: 85 });

    await carteraController.transferirAlJefe(1, 100);

    expect(addSaldoMock).toHaveBeenCalledWith(1, 85);
  });
});
