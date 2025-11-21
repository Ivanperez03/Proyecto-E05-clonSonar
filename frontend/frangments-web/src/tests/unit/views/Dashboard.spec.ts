import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardView from "@/views/Dashboard.vue";

// ---- mocks compartidos ----
const pushMock = vi.fn();
const fetchMeMock = vi.fn();
const logoutMock = vi.fn();

// estado mutable del auth
const authState = {
  user: {
    id: 1,
    nombre: "Pepe",
    email: "pepe@test.com",
    telefono: "123456789",
    tipo: "user",
  } as any | null,
  isAuthenticated: true,
};

// mock router
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// mock auth store
vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    get user() {
      return authState.user;
    },
    get isAuthenticated() {
      return authState.isAuthenticated;
    },
    get nombre() {
      return authState.user?.nombre ?? "";
    },
    fetchMe: fetchMeMock,
    logout: logoutMock,
  }),
}));

var getMock;

vi.mock("@/apiAxios", () => {
  getMock = vi.fn().mockResolvedValue({ data: [] });
  return {
    default: {
      get: getMock,
    },
  };
});


describe("DashboardView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = {
      id: 1,
      nombre: "Pepe",
      email: "pepe@test.com",
      telefono: "123456789",
      tipo: "user",
    };
    authState.isAuthenticated = true;

    getMock.mockResolvedValue({ data: [] });
  });

  it("muestra saludo con el nombre del usuario", async () => {
    const wrapper = mount(DashboardView);
    await flushPromises();

    expect(wrapper.text()).toContain("Bienvenido de vuelta, Pepe");
  });

  it("tiene 5 tarjetas de plataformas", async () => {
    const wrapper = mount(DashboardView);
    await flushPromises();

    const cards = wrapper.findAll(".plataforma-card");
    expect(cards.length).toBe(5);
  });

  it("botones de navegación llevan a las rutas correctas", async () => {
    const wrapper = mount(DashboardView);
    await flushPromises();

    const btnCuenta = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Mi cuenta"))!;
    const btnAdmin = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Administrador"))!;
    const btnBuscar = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Explorar planes"))!;
    const btnCrear = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Crear plan"))!;

    await btnCuenta.trigger("click");
    await btnAdmin.trigger("click");
    await btnBuscar.trigger("click");
    await btnCrear.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({ name: "cuenta" });
    expect(pushMock).toHaveBeenCalledWith({ name: "admin" });
    expect(pushMock).toHaveBeenCalledWith({ name: "buscador" });
    expect(pushMock).toHaveBeenCalledWith({ name: "ofertar" });
  });

  it("logout llama al store y navega a home", async () => {
    const wrapper = mount(DashboardView);
    await flushPromises();

    const btnLogout = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Salir"))!;
    await btnLogout.trigger("click");

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith({ name: "home" });
  });

  it("si no está autenticado, redirige a login y NO llama a /users", async () => {
    authState.user = null;
    authState.isAuthenticated = false;

    const wrapper = mount(DashboardView);
    await flushPromises();

    expect(fetchMeMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith({ name: "login" });
    expect(getMock).not.toHaveBeenCalled(); // no llega al apiax.get
  });

  it("al hacer click en una plataforma navega a plataforma-detalle con el id correcto", async () => {
    const wrapper = mount(DashboardView);
    await flushPromises();

    const firstCard = wrapper.get(".plataforma-card");
    await firstCard.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({
      name: "plataforma-detalle",
      params: { id: 1 }, // primera plataforma del array interno
    });
  });
});
