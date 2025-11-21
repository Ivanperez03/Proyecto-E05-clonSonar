import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CuentaView from "@/views/CuentaView.vue";

// ---- estado / mocks compartidos ----
const pushMock = vi.fn();

// auth state mutable para configurar por test
const authState = {
  user: null as any,
  isAuthenticated: false,
};
const fetchMeMock = vi.fn();
const logoutMock = vi.fn();

// account state & mocks
const accountState = {
  saldo: 0,
  grupos: [] as any[],
  suscripciones: [] as any[],
};
const userDataMock = vi.fn();
const createGroupMock = vi.fn();

// router mock
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// auth store mock
vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    get user() {
      return authState.user;
    },
    get isAuthenticated() {
      return authState.isAuthenticated;
    },
    fetchMe: fetchMeMock,
    logout: logoutMock,
  }),
}));

// account store mock
vi.mock("@/stores/cuenta", () => ({
  useAccountStore: () => ({
    get saldo() {
      return accountState.saldo;
    },
    get grupos() {
      return accountState.grupos;
    },
    get suscripciones() {
      return accountState.suscripciones;
    },
    loading: false,
    userData: userDataMock,
    createGroup: createGroupMock,
  }),
}));

// mock de alert global
const alertMock = vi.fn();
(globalThis as any).alert = alertMock;

describe("CuentaView", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // estado por defecto: usuario logueado
    authState.user = {
      id: 1,
      nombre: "Pepe",
      email: "pepe@test.com",
      telefono: "123456789",
      tipo: "user",
    };
    authState.isAuthenticated = true;

    accountState.saldo = 20;
    accountState.grupos = [{ nombre: "Grupo 1" }];
    accountState.suscripciones = [
      { id: 1, nombre: "Spotify", precio: 3.5, fechaVencimiento: "2025-01-01" },
    ];
  });

  it("si el usuario está autenticado, llama a userData al montar", async () => {
    mount(CuentaView);
    await flushPromises();

    expect(userDataMock).toHaveBeenCalled();
  });

  it("si NO está autenticado, redirige a login", async () => {
    authState.user = null;
    authState.isAuthenticated = false;

    mount(CuentaView);
    await flushPromises();

    expect(pushMock).toHaveBeenCalledWith({ name: "login" });
  });

  it("muestra los datos personales y el saldo", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    expect(wrapper.text()).toContain("Pepe");
    expect(wrapper.text()).toContain("pepe@test.com");
    expect(wrapper.text()).toContain("20 €");
  });

  it("muestra grupos y suscripciones", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    expect(wrapper.text()).toContain("Grupo 1");
    expect(wrapper.text()).toContain("Spotify");
  });

  it("permite crear un grupo cuando se introduce un nombre válido", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    // pulsar "+ Crear grupo"
    const btnCrear = wrapper.get(".panel-actions .btn.icon");
    await btnCrear.trigger("click");

    const input = wrapper.get(".nuevo-grupo .input");
    await input.setValue("Nuevo grupo");

    const btnConfirmar = wrapper
      .findAll(".group-actions .btn")
      .find((b) => b.text().includes("Crear"))!;
    await btnConfirmar.trigger("click");

    expect(createGroupMock).toHaveBeenCalledWith("Nuevo grupo");
    expect(alertMock).not.toHaveBeenCalledWith(
      "Por favor, introduce un nombre para el grupo."
    );
  });

  it("si intentas crear grupo con nombre vacío, muestra alerta y no llama al store", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    const btnCrear = wrapper.get(".panel-actions .btn.icon");
    await btnCrear.trigger("click");

    const btnConfirmar = wrapper
      .findAll(".group-actions .btn")
      .find((b) => b.text().includes("Crear"))!;
    await btnConfirmar.trigger("click");

    expect(createGroupMock).not.toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(
      "Por favor, introduce un nombre para el grupo."
    );
  });

  it("botón Volver redirige a dashboard", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    await wrapper.get(".btn.secondary").trigger("click");
    expect(pushMock).toHaveBeenCalledWith({ name: "dashboard" });
  });

  it("botón Cerrar sesión llama a logout y redirige a login", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    await wrapper.get(".btn.logout").trigger("click");

    expect(logoutMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith({ name: "login" });
  });
});
