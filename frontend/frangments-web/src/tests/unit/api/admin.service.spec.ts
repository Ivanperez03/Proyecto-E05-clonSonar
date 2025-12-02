import { describe, it, expect, vi, beforeEach } from "vitest";
import apiax from "@/apiAxios";
import { adminService } from "@/api/admin.service";

vi.mock("@/apiAxios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("adminService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUsers hace GET a /admin/usuarios y devuelve data", async () => {
    (apiax.get as any).mockResolvedValueOnce({ data: [{ id: 1 }] });

    const res = await adminService.getUsers();

    expect(apiax.get).toHaveBeenCalledWith("/admin/usuarios");
    expect(res).toEqual([{ id: 1 }]);
  });

  it("getGrupos hace GET a /admin/grupos", async () => {
    (apiax.get as any).mockResolvedValueOnce({ data: ["g1"] });

    const res = await adminService.getGrupos();

    expect(apiax.get).toHaveBeenCalledWith("/admin/grupos");
    expect(res).toEqual(["g1"]);
  });

  it("getOfertas hace GET a /admin/ofertas", async () => {
    (apiax.get as any).mockResolvedValueOnce({ data: ["o1"] });

    const res = await adminService.getOfertas();

    expect(apiax.get).toHaveBeenCalledWith("/admin/ofertas");
    expect(res).toEqual(["o1"]);
  });

  it("deleteUser llama a DELETE /admin/usuarios/:id", async () => {
    (apiax.delete as any).mockResolvedValueOnce({});

    await adminService.deleteUser(7);

    expect(apiax.delete).toHaveBeenCalledWith("/admin/usuarios/7");
  });

  it("promoteUser llama a POST /admin/usuarios/:id/promover", async () => {
    (apiax.post as any).mockResolvedValueOnce({});

    await adminService.promoteUser(9);

    expect(apiax.post).toHaveBeenCalledWith("/admin/usuarios/9/promover");
  });

  it("deleteGrupo llama a DELETE /admin/grupos/:id", async () => {
    (apiax.delete as any).mockResolvedValueOnce({});

    await adminService.deleteGrupo(3);

    expect(apiax.delete).toHaveBeenCalledWith("/admin/grupos/3");
  });

  it("deleteOferta llama a DELETE /admin/ofertas/:id", async () => {
    (apiax.delete as any).mockResolvedValueOnce({});

    await adminService.deleteOferta(4);

    expect(apiax.delete).toHaveBeenCalledWith("/admin/ofertas/4");
  });

  it("updateSaldo llama a PUT /admin/usuarios/:id/saldo con body correcto", async () => {
    (apiax.put as any).mockResolvedValueOnce({});

    await adminService.updateSaldo(5, 100);

    expect(apiax.put).toHaveBeenCalledWith(
      "/admin/usuarios/5/saldo",
      { saldo: 100 }
    );
  });
});
