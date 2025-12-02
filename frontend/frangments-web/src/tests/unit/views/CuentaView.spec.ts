import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CuentaView from "@/views/CuentaView.vue";

// ---- router mock ----
const pushMock = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// ---- auth store mock ----
const authState = {
  user: null as any,
  isAuthenticated: false,
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
    fetchMe: fetchMeMock,
    logout: logoutMock,
  }),
}));

// ---- account store mock ----
const accountState = {
  saldo: 0,
  grupos: [] as any[],
  suscripciones: [] as any[],
  loading: false,
};

const userDataMock = vi.fn();
const createGroupMock = vi.fn();

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
    get loading() {
      return accountState.loading;
    },
    userData: userDataMock,
    createGroup: createGroupMock,
  }),
}));

// mock de alert global para crearGrupo()
const alertMock = vi.fn();
(globalThis as any).alert = alertMock;

describe("CuentaView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushMock.mockReset();

    // estado por defecto: usuario logueado con datos
    authState.user = {
      id: 1,
      nombre: "Pepe",
      email: "pepe@test.com",
      telefono: "123456789",
      tipo: "user",
    };
    authState.isAuthenticated = true;

    accountState.saldo = 20;
    accountState.loading = false;
    accountState.grupos = [{ nombre: "Grupo 1" }];
    accountState.suscripciones = [
      {
        id: 1,
        nombre: "Spotify",
        precio: 3.5,
        fechaVencimiento: "2025-01-01",
      },
    ];
  });

  it("si el usuario está autenticado, llama a account.userData al montar", async () => {
    mount(CuentaView);
    await flushPromises();

    expect(userDataMock).toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalledWith({ name: "login" });
  });

  it("si NO está autenticado, redirige a login", async () => {
    authState.user = null;
    authState.isAuthenticated = false;
    fetchMeMock.mockResolvedValue(undefined); // onMounted llamará a fetchMe

    mount(CuentaView);
    await flushPromises();

    expect(pushMock).toHaveBeenCalledWith({ name: "login" });
  });

  it("muestra los datos personales y el saldo", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    const text = wrapper.text();
    expect(text).toContain("Pepe");
    expect(text).toContain("pepe@test.com");
    expect(text).toContain("123456789");
    expect(text).toContain("20 €");
  });

  it('si no hay teléfono muestra "No disponible"', async () => {
    authState.user.telefono = null;

    const wrapper = mount(CuentaView);
    await flushPromises();

    expect(wrapper.text()).toContain("No disponible");
  });

  it("muestra grupos y suscripciones cuando existen", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    const text = wrapper.text();
    expect(text).toContain("Grupos");
    expect(text).toContain("Grupo 1");
    expect(text).toContain("Suscripciones activas");
    expect(text).toContain("Spotify");
    expect(text).toContain("3.5€");
    expect(text).toContain("Vence: 2025-01-01");
  });

  it("muestra mensajes vacíos si no hay grupos ni suscripciones", async () => {
    accountState.grupos = [];
    accountState.suscripciones = [];

    const wrapper = mount(CuentaView);
    await flushPromises();

    const text = wrapper.text();
    expect(text).toContain("No perteneces a ningún grupo.");
    expect(text).toContain("No tienes suscripciones activas.");
  });

  it("muestra 'Cargando...' cuando loading es true", async () => {
    accountState.loading = true;

    const wrapper = mount(CuentaView);
    await flushPromises();

    expect(wrapper.text()).toContain("Cargando...");
  });

  it("botón Volver redirige a dashboard", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    await wrapper.get(".btn.secondary").trigger("click");
    expect(pushMock).toHaveBeenCalledWith({ name: "dashboard" });
  });

  it("botón Añadir saldo redirige a plataformaPago", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    await wrapper.get(".btn.saldo").trigger("click");
    expect(pushMock).toHaveBeenCalledWith({ name: "plataformapago" });
  });

  it("botón Cerrar sesión llama a logout y redirige a login", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    await wrapper.get(".btn.logout").trigger("click");

    expect(logoutMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith({ name: "login" });
  });

  it("crearGrupo muestra alerta si el nombre está vacío y no llama al store", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    // acceder directamente a la función del script setup
    // @ts-expect-error - vitest no sabe el tipo exacto de vm
    await wrapper.vm.crearGrupo();

    expect(alertMock).toHaveBeenCalledWith(
      "Por favor, introduce un nombre para el grupo."
    );
    expect(createGroupMock).not.toHaveBeenCalled();
  });

  it("crearGrupo llama a account.createGroup con nombre válido y limpia el campo", async () => {
    const wrapper = mount(CuentaView);
    await flushPromises();

    // setear el ref nuevoGrupo desde la instancia:
    // @ts-expect-error - acceso directo a refs internos
    wrapper.vm.nuevoGrupo = "Nuevo grupo";

    createGroupMock.mockResolvedValue(undefined);

    // @ts-expect-error
    await wrapper.vm.crearGrupo();
    await flushPromises();

    expect(createGroupMock).toHaveBeenCalledWith("Nuevo grupo");
    // @ts-expect-error
    expect(wrapper.vm.nuevoGrupo).toBe("");
  });
});
