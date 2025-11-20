import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAccountStore } from "@/stores/cuenta";
import { accountService } from "@/api/cuenta.service";
import { Grupo } from "@/domain/grupo";
import { Suscripcion } from "@/domain/suscripcion";

vi.mock("@/api/cuenta.service", () => ({
  accountService: {
    getUserData: vi.fn(),
    createGroup: vi.fn(),
  },
}));

describe("useAccountStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("userData rellena saldo, grupos y suscripciones y gestiona loading", async () => {
    (accountService.getUserData as any).mockResolvedValueOnce({
      saldo: 25,
      grupos: [{ id_grupo: 1, nombre: "Grupo A", estado: "abierto", id_jefe: 3 }],
      suscripciones: [
        {
          id: 10,
          nombre: "Spotify",
          precio_plan: 3.5,
          fecha_vencimiento: "2025-12-31",
        },
      ],
    });

    const store = useAccountStore();

    const p = store.userData();
    expect(store.loading).toBe(true);

    await p;

    expect(accountService.getUserData).toHaveBeenCalled();
    expect(store.loading).toBe(false);
    expect(store.saldo).toBe(25);
    expect(store.grupos).toHaveLength(1);
    expect(store.grupos[0]).toBeInstanceOf(Grupo);
    expect(store.grupos[0].nombre).toBe("Grupo A");
    expect(store.suscripciones).toHaveLength(1);
    expect(store.suscripciones[0]).toBeInstanceOf(Suscripcion);
    expect(store.suscripciones[0].nombre).toBe("Spotify");
  });

  it("createGroup añade el grupo a la lista", async () => {
    (accountService.createGroup as any).mockResolvedValueOnce({
      group: { id_grupo: 2, nombre: "Nuevo Grupo", estado: "abierto", id_jefe: 4 },
    });

    const store = useAccountStore();
    expect(store.grupos).toHaveLength(0);

    const group = await store.createGroup("Nuevo Grupo");

    expect(accountService.createGroup).toHaveBeenCalledWith("Nuevo Grupo");
    expect(store.grupos).toHaveLength(1);
    expect(store.grupos[0]).toBeInstanceOf(Grupo);
    expect(store.grupos[0].nombre).toBe("Nuevo Grupo");
    expect(group.nombre).toBe("Nuevo Grupo");
  });
});
