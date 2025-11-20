import { describe, it, expect, vi, beforeEach } from "vitest";
import apiax from "@/apiAxios";
import { accountService } from "@/api/cuenta.service";

vi.mock("@/apiAxios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("accountService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("getUserData hace GET /user/data y devuelve data", async () => {
    (apiax.get as any).mockResolvedValueOnce({
      data: { saldo: 50, grupos: [], suscripciones: [] },
    });
    const res = await accountService.getUserData();
    expect(apiax.get).toHaveBeenCalledWith("/user/data");
    expect(res).toEqual({ saldo: 50, grupos: [], suscripciones: [] });
  });

  it("createGroup hace POST /grupo con nombre y devuelve data", async () => {
    (apiax.post as any).mockResolvedValueOnce({
      data: { message: "OK", group: { id_grupo: 1, nombre: "Grupo test" } },
    });

    const res = await accountService.createGroup("Grupo test");

    expect(apiax.post).toHaveBeenCalledWith("/grupo", { nombre: "Grupo test" });
    expect(res.group.nombre).toBe("Grupo test");
  });
});
