import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { authService } from "@/api/auth.service";

vi.mock("@/api/auth.service", () => ({
  authService: {
    login: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("login exitoso llama a login + me y setea user", async () => {
    (authService.login as any).mockResolvedValueOnce({});
    (authService.me as any).mockResolvedValueOnce({
      id: 1,
      nombre: "Oscar",
      email: "o@test.com",
      telefono: "123",
      tipo: "user",
    });

    const store = useAuthStore();

    const p = store.login("o@test.com", "pwd");

    expect(store.loading).toBe(true);
    await p;

    expect(authService.login).toHaveBeenCalledWith("o@test.com", "pwd");
    expect(authService.me).toHaveBeenCalled();

    expect(store.loading).toBe(false);
    expect(store.user?.nombre).toBe("Oscar");
    expect(store.error).toBe("");
    expect(store.isAuthenticated).toBe(true);
  });

  it("login con error rellena error y mantiene user null", async () => {
    (authService.login as any).mockRejectedValueOnce({
      response: { data: { message: "Credenciales inválidas" } },
    });

    const store = useAuthStore();

    await expect(store.login("bad@test.com", "wrong")).rejects.toBeTruthy();

    expect(store.loading).toBe(false);
    expect(store.user).toBeNull();
    expect(store.error).toBe("Credenciales inválidas");
  });

  it("fetchMe setea user si el backend responde", async () => {
    (authService.me as any).mockResolvedValueOnce({
      id: 2,
      nombre: "Ana",
      email: "a@test.com",
      telefono: "",
      tipo: "admin",
    });

    const store = useAuthStore();

    await store.fetchMe();

    expect(authService.me).toHaveBeenCalled();
    expect(store.user?.nombre).toBe("Ana");
    expect(store.isAdmin).toBe(true);
  });

  it("logout llama a service y limpia user", async () => {
    (authService.logout as any).mockResolvedValueOnce({});
    const store = useAuthStore();
    store.user = {
      id: 1,
      nombre: "X",
      email: "",
      telefono: "",
      tipo: "user",
    } as any;

    await store.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});
