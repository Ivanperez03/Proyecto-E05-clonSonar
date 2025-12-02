import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminView from "@/views/AdminView.vue";

// ---- Mocks compartidos ----
const pushMock = vi.fn();
const logoutMock = vi.fn();
const fetchMeMock = vi.fn();
const loadAllMock = vi.fn();
const eliminarUsuarioMock = vi.fn();
const promoverUsuarioMock = vi.fn();
const eliminarGrupoMock = vi.fn();
const eliminarOfertaMock = vi.fn();

// mock router
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// mock auth store
vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    user: { id: 1, nombre: "Admin", email: "admin@test.com", tipo: "admin" },
    isAdmin: true,
    fetchMe: fetchMeMock,
    logout: logoutMock,
  }),
}));

// mock admin store
vi.mock("@/stores/admin", () => ({
  useAdminStore: () => ({
    users: [
      { id_usuario: 1, nombre: "User 1", mail: "u1@test.com", tipo: "user" },
    ],
    grupos: [{ id: 10, nombre: "Grupo 1" }],
    ofertas: [
      { id: 100, plataforma: "Spotify", precio: 5, usuario: "User 1", grupo: "Grupo 1" },
    ],
    loadAll: loadAllMock,
    eliminarUsuario: eliminarUsuarioMock,
    promoverUsuario: promoverUsuarioMock,
    eliminarGrupo: eliminarGrupoMock,
    eliminarOferta: eliminarOfertaMock,
    actualizarSaldo: vi.fn(),
  }),
}));

describe("AdminView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra la sección de usuarios por defecto", () => {
    const wrapper = mount(AdminView);

    expect(wrapper.text()).toContain("Usuarios registrados");
    expect(wrapper.find("section.panel h3").text()).toBe("Usuarios registrados");
  });

  it("cambia de sección al hacer click en los botones de navegación", async () => {
    const wrapper = mount(AdminView);

    // Grupos
    await wrapper.get("button:nth-of-type(2)").trigger("click");
    expect(wrapper.text()).toContain("Grupos registrados");

    // Ofertas
    await wrapper.get("button:nth-of-type(3)").trigger("click");
    expect(wrapper.text()).toContain("Ofertas publicadas");
  });

  it("llama a logout y redirige a login al pulsar Cerrar sesión", async () => {
    const wrapper = mount(AdminView);

    const btnLogout = wrapper.get("button.btn-pill-red");
    await btnLogout.trigger("click");

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith({ name: "login" });
  });

  it("redirige al dashboard al pulsar Volver", async () => {
    const wrapper = mount(AdminView);

    const btnVolver = wrapper.get("button.btn-pill-dark");
    await btnVolver.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({ name: "dashboard" });
  });
});
