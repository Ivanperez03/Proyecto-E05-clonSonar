import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardView from "@/views/Dashboard.vue";
import apiax from "@/apiAxios";

// ---- router mock ----
const pushMock = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// ---- auth store mock ----
const authState = {
  user: {
    id: 1,
    nombre: "Pepe",
    tipo: "user",
  } as any,
  isAuthenticated: true,
};

const fetchMeMock = vi.fn();
const logoutMock = vi.fn();

vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    get user() {
      return authState.user;
    },
    get isAuthenticated() {
      return authState.isAuthenticated;
    },
    // 👈 tu Dashboard.vue usa "auth.nombre || 'usuario'"
    get nombre() {
      return authState.user?.nombre;
    },
    fetchMe: fetchMeMock,
    logout: logoutMock,
  }),
}));

// ---- alert store mock ----
const fetchAlertasMock = vi.fn();
const toggleDropdownMock = vi.fn();
const marcarTodasMock = vi.fn();

const alertState = {
  alertas: [] as any[],
  alertasNoVistas: 0,
  showDropdown: false,
};

vi.mock("@/stores/alertas", () => ({
  useAlertStore: () => ({
    alertas: alertState.alertas,
    alertasNoVistas: alertState.alertasNoVistas,
    showDropdown: alertState.showDropdown,
    fetchAlertas: fetchAlertasMock,
    toggleDropdown: toggleDropdownMock,
    marcarTodasComoVistas: marcarTodasMock,
  }),
}));

// ---- apiAxios mock ----
vi.mock("@/apiAxios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("DashboardView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushMock.mockReset();

    authState.user = { id: 1, nombre: "Pepe", tipo: "user" };
    authState.isAuthenticated = true;

    alertState.alertas = [];
    alertState.alertasNoVistas = 0;
    alertState.showDropdown = false;

    (apiax as any).get.mockReset?.();
    (apiax as any).get.mockResolvedValue({ data: [] });
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

    // 👉 Aquí seleccionamos explícitamente el botón "Mi cuenta"
    const btnCuenta = wrapper
      .findAll("button.btn.small.primary")
      .find((b) => b.text().includes("Mi cuenta"))!;
    await btnCuenta.trigger("click");
    expect(pushMock).toHaveBeenCalledWith({ name: "cuenta" });
    pushMock.mockClear();

    // "Explorar planes"
    const btnBuscar = wrapper
      .findAll("button.btn.small.primary")
      .find((b) => b.text().includes("Explorar planes"))!;
    await btnBuscar.trigger("click");
    expect(pushMock).toHaveBeenCalledWith({ name: "buscador" });

    // "Crear plan"
    const btnCrear = wrapper
      .findAll("button.btn.small.primary")
      .find((b) => b.text().includes("Crear plan"))!;
    await btnCrear.trigger("click");
    expect(pushMock).toHaveBeenCalledWith({ name: "ofertar" });
  });

  it("logout llama al store y navega a home", async () => {
    const wrapper = mount(DashboardView);
    await flushPromises();

    await wrapper.get("button.btn.logout").trigger("click");

    expect(logoutMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith({ name: "home" });
  });

  it("si no está autenticado, redirige a login y NO llama a /users", async () => {
    // Ojo: dejamos user definido para que el template no pete con auth.user.tipo,
    // pero marcamos isAuthenticated = false para que el onMounted redirija.
    authState.isAuthenticated = false;

    mount(DashboardView);
    await flushPromises();

    expect(pushMock).toHaveBeenCalledWith({ name: "login" });
    expect((apiax as any).get).not.toHaveBeenCalledWith("/users");
  });

  it("al hacer click en una plataforma navega a plataforma-detalle con el id correcto", async () => {
    const wrapper = mount(DashboardView);
    await flushPromises();

    const firstCard = wrapper.get(".plataforma-card");
    await firstCard.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({
      name: "plataforma-detalle",
      params: { id: 1 },
    });
  });
});
