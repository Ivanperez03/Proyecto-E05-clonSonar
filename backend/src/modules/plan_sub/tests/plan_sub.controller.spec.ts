import { describe, it, expect, vi, beforeEach } from "vitest";
import { planSubController } from "../plan_sub.controller";
import { planSubRepo } from "../plan_sub.repositoy";

// Mock del repositorio de planes de suscripción
vi.mock("../plan_sub.repositoy", () => ({
  planSubRepo: {
    createSubscription: vi.fn(),
  },
}));

describe("planSubController.createSubscription", () => {
  let req: any;
  let res: any;
  let json: any;
  let status: any;

  beforeEach(() => {
    vi.clearAllMocks();

    json = vi.fn().mockReturnThis();
    status = vi.fn().mockReturnThis();

    res = {
      json,
      status,
    } as any;

    req = {
      body: {},
    } as any;
  });

  it("devuelve 400 si faltan campos obligatorios", async () => {
    // body vacío → faltan todos
    req.body = {
      // id_plataforma: 1,
      // precio: 10,
      // fecha_vencimiento: "2025-12-31",
      // id_grupo: 5,
      // nmiembros: 4,
    };

    await planSubController.createSubscription(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Faltan campos" })
    );
    expect(planSubRepo.createSubscription).not.toHaveBeenCalled();
  });

  it("crea la suscripción y devuelve 201 cuando los datos son correctos", async () => {
    req.body = {
      id_plataforma: 1,
      precio: 12.99,
      fecha_vencimiento: "2025-12-31",
      id_grupo: 3,
      nmiembros: 4,
    };

    const fakeSub = {
      id_plan: 1,
      id_plataforma: 1,
      precio_plan: 12.99,
      fecha_vencimiento: "2025-12-31T00:00:00.000Z",
      id_grupo: 3,
      nmiembros: 4,
    };

    (planSubRepo.createSubscription as any).mockResolvedValue(fakeSub);

    await planSubController.createSubscription(req, res);

    expect(planSubRepo.createSubscription).toHaveBeenCalledWith({
      id_plataforma: 1,
      precio: 12.99,
      fecha_vencimiento: "2025-12-31",
      id_grupo: 3,
      nmiembros: 4,
    });
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      message: "Suscripción creada con éxito",
      subscription: fakeSub,
    });
  });

  it("devuelve 500 si el repo lanza un error", async () => {
    req.body = {
      id_plataforma: 1,
      precio: 12.99,
      fecha_vencimiento: "2025-12-31",
      id_grupo: 3,
      nmiembros: 4,
    };

    (planSubRepo.createSubscription as any).mockRejectedValue(
      new Error("Fallo en la BD")
    );

    await planSubController.createSubscription(req, res);

    expect(planSubRepo.createSubscription).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al crear suscripción",
      })
    );
  });
});
