import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterView from "@/views/RegisterView.vue";

const pushMock = vi.fn();
var postMock; 

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/apiAxios", () => {
  postMock = vi.fn();
  return {
    default: {
      post: postMock,
    },
  };
});

describe("RegisterView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillForm = async (wrapper: any, overrides: Partial<any> = {}) => {
    const nombre = overrides.nombre ?? "Pepe";
    const apellidos = overrides.apellidos ?? "Pérez";
    const email = overrides.email ?? "test@test.com";
    const telefono = overrides.telefono ?? "666555444";
    const password = overrides.password ?? "123456";
    const confirmPassword =
      overrides.confirmPassword ?? overrides.password ?? "123456";

    const inputs = wrapper.findAll("input");
    await inputs[0].setValue(nombre);
    await inputs[1].setValue(apellidos);
    await inputs[2].setValue(email);
    await inputs[3].setValue(telefono);
    await inputs[4].setValue(password);
    await inputs[5].setValue(confirmPassword);
  };

  it("si las contraseñas no coinciden muestra mensaje y no llama a la API", async () => {
    const wrapper = mount(RegisterView);

    await fillForm(wrapper, { password: "123456", confirmPassword: "654321" });
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Las contraseñas no coinciden.");
    expect(postMock).not.toHaveBeenCalled();
  });

  it("si el teléfono es inválido muestra mensaje y no llama a la API", async () => {
    const wrapper = mount(RegisterView);

    await fillForm(wrapper, { telefono: "abc" });
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain(
      "El teléfono debe contener solo números de 9 dígitos."
    );
    expect(postMock).not.toHaveBeenCalled();
  });

  it("con datos válidos llama a /users y navega a /login", async () => {
    postMock.mockResolvedValueOnce({});

    const wrapper = mount(RegisterView);

    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(postMock).toHaveBeenCalledTimes(1);
    const [url, payload] = postMock.mock.calls[0];
    expect(url).toBe("/users");
    expect(payload).toMatchObject({
      nombre: "Pepe",
      email: "test@test.com",
      telefono: "666555444",
      password: "123456",
    });

    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  it("si el backend devuelve error con message lo muestra", async () => {
    postMock.mockRejectedValueOnce({
      response: { data: { message: "Email ya existe" } },
    });

    const wrapper = mount(RegisterView);

    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Email ya existe");
  });

  it("si el error no tiene response.message, muestra el message del error", async () => {
    // tu código hace: e.response?.data?.message ?? e.message ?? "Error registrando usuario"
    postMock.mockRejectedValueOnce(new Error("Fallo cualquiera"));

    const wrapper = mount(RegisterView);

    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Fallo cualquiera");
  });
});
