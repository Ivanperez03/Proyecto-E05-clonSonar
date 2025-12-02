import { describe, it, expect, vi, beforeEach } from "vitest";
import apiax from "@/apiAxios";
import { authService } from "@/api/auth.service";
import { User } from "@/domain/user";

vi.mock("@/apiAxios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/domain/user", () => ({
  User: {
    fromDTO: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login hace POST /users/login y devuelve User.fromDTO", async () => {
    (apiax.post as any).mockResolvedValueOnce({
      data: { user: { id_usuario: 1, nombre: "Oscar" } },
    });
    (User.fromDTO as any).mockReturnValueOnce({ id: 1, nombre: "Oscar" });

    const res = await authService.login("oscar@test.com", "secret");

    expect(apiax.post).toHaveBeenCalledWith("/users/login", {
      email: "oscar@test.com",
      password: "secret",
    });
    expect(User.fromDTO).toHaveBeenCalledWith({ id_usuario: 1, nombre: "Oscar" });
    expect(res).toEqual({ id: 1, nombre: "Oscar" });
  });

  it("me hace GET /users/me y devuelve User.fromDTO", async () => {
    (apiax.get as any).mockResolvedValueOnce({
      data: { user: { id_usuario: 2, nombre: "Ana" } },
    });
    (User.fromDTO as any).mockReturnValueOnce({ id: 2, nombre: "Ana" });

    const res = await authService.me();

    expect(apiax.get).toHaveBeenCalledWith("/users/me");
    expect(User.fromDTO).toHaveBeenCalledWith({ id_usuario: 2, nombre: "Ana" });
    expect(res).toEqual({ id: 2, nombre: "Ana" });
  });

  it("logout hace POST /users/logout", async () => {
    (apiax.post as any).mockResolvedValueOnce({});

    await authService.logout();

    expect(apiax.post).toHaveBeenCalledWith("/users/logout");
  });
});
