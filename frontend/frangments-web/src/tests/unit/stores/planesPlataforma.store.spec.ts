import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePlanesPlataformaStore } from "@/stores/planesPlataforma";
import { planesPlataformaService } from "@/api/planesPlataforma.service";

vi.mock("@/api/planesPlataforma.service", () => ({
  planesPlataformaService: {
    getPlanesActivos: vi.fn(),
    unirseAPlan: vi.fn(),
  },
}));

describe("usePlanesPlataformaStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("cargarPlanes rellena planes y limpia error", async () => {
    (planesPlataformaService.getPlanesActivos as any).mockResolvedValueOnce([
      {
        id_plan: 1,
        precio_mensual: 9.99,
        fecha_vencimiento: "2025-12-31",
        id_grupo: 2,
        nombre_grupo: "Grupo Spotify",
      },
    ]);

    const store = usePlanesPlataformaStore();

    const p = store.cargarPlanes(1);
    expect(store.loading).toBe(true);

    await p;

    expect(planesPlataformaService.getPlanesActivos).toHaveBeenCalledWith(1);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.planes).toHaveLength(1);
    expect(store.hayPlanes).toBe(true);
  });

  it("cargarPlanes con error limpia planes y setea error", async () => {
    (planesPlataformaService.getPlanesActivos as any).mockRejectedValueOnce({
      response: { data: { message: "Fallo back" } },
    });

    const store = usePlanesPlataformaStore();

    await store.cargarPlanes(99);

    expect(store.planes).toHaveLength(0);
    expect(store.error).toBe("Fallo back");
    expect(store.hayPlanes).toBe(false);
  });

  it("unirse devuelve los datos del service", async () => {
    (planesPlataformaService.unirseAPlan as any).mockResolvedValueOnce({
      message: "OK",
      id_grupo: 5,
    });

    const store = usePlanesPlataformaStore();

    const res = await store.unirse(3);

    expect(planesPlataformaService.unirseAPlan).toHaveBeenCalledWith(3);
    expect(res).toEqual({ message: "OK", id_grupo: 5 });
  });

  it("unirse lanza Error con mensaje amigable si el service falla", async () => {
    (planesPlataformaService.unirseAPlan as any).mockRejectedValueOnce({
      response: { data: { message: "Grupo lleno" } },
    });

    const store = usePlanesPlataformaStore();

    await expect(store.unirse(3)).rejects.toThrow("Grupo lleno");
  });
});
