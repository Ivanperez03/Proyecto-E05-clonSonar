import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlataformaPagoView from "@/views/PlataformaPagoView.vue";
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
    id: 10,
    saldo: 100,
  } as any,
};

vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    get user() {
      return authState.user;
    },
  }),
}));

// ---- apiAxios mock ----
// OJO: nada de variables externas aquí
vi.mock("@/apiAxios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("PlataformaPagoView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushMock.mockReset();

    authState.user = { id: 10, saldo: 100 };

    localStorage.setItem("token", "fake-token");
    (apiax as any).post.mockReset?.();
  });

  it("muestra mensaje si la cantidad no es válida y no llama a la API", async () => {
    const wrapper = mount(PlataformaPagoView);

    const btn = wrapper.get(".btn-pay");
    await btn.trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("Introduce una cantidad válida.");
    expect((apiax as any).post).not.toHaveBeenCalled();
  });

  it("con cantidad válida llama a la API, actualiza saldo y limpia el input", async () => {
    const wrapper = mount(PlataformaPagoView);

    const input = wrapper.get("input[type='number']");
    await input.setValue("15");

    (apiax as any).post.mockResolvedValue({
      data: { message: "Saldo añadido correctamente ✔" },
    });

    const btn = wrapper.get(".btn-pay");
    await btn.trigger("click");
    await flushPromises();

    expect((apiax as any).post).toHaveBeenCalledWith(
      "/cartera/10/recargar",
      { cantidad: 15 },
      {
        headers: { Authorization: "Bearer fake-token" },
      }
    );

    // se actualiza el saldo en el authState simulado
    expect(authState.user.saldo).toBe(115);
    // input limpiado
    expect((input.element as HTMLInputElement).value).toBe("");
    expect(wrapper.text()).toContain("Saldo añadido correctamente ✔");
  });

  it("en caso de error muestra mensaje de error del backend o genérico", async () => {
    const wrapper = mount(PlataformaPagoView);

    const input = wrapper.get("input[type='number']");
    const btn = wrapper.get(".btn-pay");

    // 1º error con mensaje del backend
    await input.setValue("20");
    (apiax as any).post.mockRejectedValueOnce({
      response: { data: { message: "Error al añadir saldo desde API" } },
    });

    await btn.trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("Error al añadir saldo desde API");

    // 2º error genérico sin response
    await input.setValue("25");
    (apiax as any).post.mockRejectedValueOnce(new Error("fail"));

    await btn.trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("❌ Error al añadir saldo");
  });

  it("botón volver navega a cuenta", async () => {
    const wrapper = mount(PlataformaPagoView);

    const backBtn = wrapper.get(".back-btn");
    await backBtn.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({ name: "cuenta" });
  });
});
