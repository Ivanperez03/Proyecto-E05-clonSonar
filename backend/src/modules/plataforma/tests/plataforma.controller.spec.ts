import { describe, it, expect, vi, beforeEach } from "vitest";
import { plataformaController } from "../plataforma.controller";
import { plataformaRepo } from "../plataforma.repository";

// Mock del repositorio
vi.mock("../plataforma.repository", () => ({
  plataformaRepo: {
    getAllPlatforms: vi.fn(),
  },
}));

describe("plataformaController.getAllPlatforms", () => {
  const mockReq = {} as any; // no usamos nada del req

  let json: any;
  let status: any;
  let res: any;

  beforeEach(() => {
    vi.clearAllMocks();

    json = vi.fn().mockReturnThis();
    status = vi.fn().mockReturnThis();

    res = {
      json,
      status,
    } as any;
  });

  it("devuelve 200 y la lista de plataformas cuando todo va bien", async () => {
    const fakePlataformas = [
      { id_plataforma: 1, nombre: "Netflix" },
      { id_plataforma: 2, nombre: "HBO" },
    ];

    (plataformaRepo.getAllPlatforms as any).mockResolvedValue(fakePlataformas);

    await plataformaController.getAllPlatforms(mockReq, res);

    expect(plataformaRepo.getAllPlatforms).toHaveBeenCalled();
    // por defecto Express responde 200 si no se llama a status()
    expect(json).toHaveBeenCalledWith(fakePlataformas);
  });

  it("devuelve 500 y un mensaje de error si el repo lanza excepción", async () => {
    (plataformaRepo.getAllPlatforms as any).mockRejectedValue(
      new Error("Fallo en la BD")
    );

    await plataformaController.getAllPlatforms(mockReq, res);

    expect(plataformaRepo.getAllPlatforms).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error al obtener plataformas",
      })
    );
  });
});
