import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAdminStore } from "@/stores/admin";
import { adminService } from "@/api/admin.service";

vi.mock("@/api/admin.service", () => ({
  adminService: {
    getUsers: vi.fn(),
    getGrupos: vi.fn(),
    getOfertas: vi.fn(),
    deleteUser: vi.fn(),
    promoteUser: vi.fn(),
    deleteGrupo: vi.fn(),
    deleteOferta: vi.fn(),
    updateSaldo: vi.fn(),
  },
}));

describe("useAdminStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("loadAll carga users, grupos y ofertas y gestiona loading", async () => {
    (adminService.getUsers as any).mockResolvedValueOnce([
      { id_usuario: 1, nombre: "Oscar", mail: "o@test.com", tipo: "user" },
    ]);
    (adminService.getGrupos as any).mockResolvedValueOnce([
      { id_grupo: 10, nombre: "Grupo 10" },
    ]);
    (adminService.getOfertas as any).mockResolvedValueOnce([
      { id: 5, plataforma: "Spotify" },
    ]);

    const store = useAdminStore();
    expect(store.loading).toBe(false);

    const p = store.loadAll();
    expect(store.loading).toBe(true);

    await p;

    expect(adminService.getUsers).toHaveBeenCalled();
    expect(adminService.getGrupos).toHaveBeenCalled();
    expect(adminService.getOfertas).toHaveBeenCalled();

    expect(store.loading).toBe(false);
    expect(store.users).toHaveLength(1);
    expect(store.users[0].nuevoSaldo).toBeNull();

    expect(store.grupos).toHaveLength(1);
    expect(store.grupos[0].id).toBe(10);
    expect(store.grupos[0].nombre).toBe("Grupo 10");

    expect(store.ofertas).toHaveLength(1);
    expect(store.ofertas[0].id).toBe(5);
  });

  it("eliminarUsuario llama al service y saca al usuario del array", async () => {
    const store = useAdminStore();
    store.users = [
      { id_usuario: 1, nombre: "A", mail: "", tipo: "user", nuevoSaldo: null },
      { id_usuario: 2, nombre: "B", mail: "", tipo: "user", nuevoSaldo: null },
    ];

    (adminService.deleteUser as any).mockResolvedValueOnce({});

    await store.eliminarUsuario(1);

    expect(adminService.deleteUser).toHaveBeenCalledWith(1);
    expect(store.users.map(u => u.id_usuario)).toEqual([2]);
  });

  it("promoverUsuario pone tipo=admin en el usuario", async () => {
    const store = useAdminStore();
    store.users = [
      { id_usuario: 3, nombre: "C", mail: "", tipo: "user", nuevoSaldo: null },
    ];

    (adminService.promoteUser as any).mockResolvedValueOnce({});

    await store.promoverUsuario(3);

    expect(adminService.promoteUser).toHaveBeenCalledWith(3);
    expect(store.users[0].tipo).toBe("admin");
  });

  it("actualizarSaldo llama al service y actualiza saldo/nuevoSaldo", async () => {
    const store = useAdminStore();
    const user = {
      id_usuario: 4,
      nombre: "D",
      mail: "",
      tipo: "user",
      saldo: 10,
      nuevoSaldo: 20,
    };
    store.users = [user as any];

    (adminService.updateSaldo as any).mockResolvedValueOnce({});

    await store.actualizarSaldo(user as any);

    expect(adminService.updateSaldo).toHaveBeenCalledWith(4, 20);
    expect(user.saldo).toBe(20);
    expect(user.nuevoSaldo).toBeNull();
  });
});
