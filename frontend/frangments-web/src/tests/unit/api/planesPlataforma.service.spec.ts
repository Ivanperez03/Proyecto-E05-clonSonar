import { describe, it, expect, vi, beforeEach } from "vitest";
import apiax from "@/apiAxios";
import { planesPlataformaService } from "@/api/planesPlataforma.service";

vi.mock("@/apiAxios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("planesPlataformaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPlanesActivos hace GET a /plan_sub/plataforma/:id/activos", async () => {
    (apiax.get as any).mockResolvedValueOnce({
      data: [
        { id_plan: 1, nombre_grupo: "Grupo 1", precio_mensual: "9.99" },
      ],
    });

    const res = await planesPlataformaService.getPlanesActivos(1);

    expect(apiax.get).toHaveBeenCalledWith(
      "/plan_sub/plataforma/1/activos"
    );
    expect(res).toHaveLength(1);
    expect(res[0].id_plan).toBe(1);
  });

  it("unirseAPlan hace POST a /plan_sub/:id/unirse y devuelve data", async () => {
    (apiax.post as any).mockResolvedValueOnce({
      data: { message: "Te has unido al grupo correctamente" },
    });

    const res = await planesPlataformaService.unirseAPlan(3);

    expect(apiax.post).toHaveBeenCalledWith("/plan_sub/3/unirse");
    expect(res.message).toBe("Te has unido al grupo correctamente");
  });
});
