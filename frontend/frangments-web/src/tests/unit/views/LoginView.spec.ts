import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginView from "@/views/LoginView.vue";

const pushMock = vi.fn();
const loginMock = vi.fn();

// mock router
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// mock auth store
vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    login: loginMock,
  }),
}));

describe("LoginView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillForm = async (wrapper: any, email = "test@test.com", pass = "1234") => {
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue(email);
    await inputs[1].setValue(pass);
  };

  it("envía el formulario y navega al dashboard en login correcto", async () => {
    loginMock.mockResolvedValueOnce(undefined);

    const wrapper = mount(LoginView);
    await fillForm(wrapper);

    await wrapper.get("form").trigger("submit.prevent");
    await flushPromises();

    expect(loginMock).toHaveBeenCalledWith("test@test.com", "1234");
    expect(pushMock).toHaveBeenCalledWith({ name: "dashboard" });
    expect(wrapper.text()).not.toContain("Correo o contraseña incorrectos");
  });

  it("muestra el mensaje de error devuelto por el backend", async () => {
    loginMock.mockRejectedValueOnce({
      response: { data: { message: "Credenciales inválidas" } },
    });

    const wrapper = mount(LoginView);
    await fillForm(wrapper);

    await wrapper.get("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Credenciales inválidas");
  });

  it("muestra el mensaje genérico si no hay message en la respuesta", async () => {
    loginMock.mockRejectedValueOnce(new Error("cualquier cosa"));

    const wrapper = mount(LoginView);
    await fillForm(wrapper);

    await wrapper.get("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Correo o contraseña incorrectos");
  });
});
