import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlataformaPagoView from "@/views/PlataformaPagoView.vue";

const pushMock = vi.fn();
var postMock;

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    user: { id: 1, nombre: "Pepe" },
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

describe("PlataformaPagoView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra mensaje si la cantidad no es válida y no llama a la API", async () => {
    const wrapper = mount(PlataformaPagoView);

    const btn = wrapper.get(".btn-pay");
    await btn.trigger("click");

    expect(wrapper.text()).toContain("Introduce una cantidad válida.");
    expect(postMock).not.toHaveBeenCalled();
  });

  it("con cantidad válida llama a la API y limpia el input", async () => {
    postMock.mockResolvedValueOnce({});

    const wrapper = mount(PlataformaPagoView);

    const input = wrapper.get("input");
    await input.setValue("15");

    const btn = wrapper.get(".btn-pay");
    await btn.trigger("click");

    expect(postMock).toHaveBeenCalledTimes(1);
    const [, payload] = postMock.mock.calls[0];
    expect(payload).toEqual({ cantidad: 15 });

    expect((input.element as HTMLInputElement).value).toBe("");
    expect(wrapper.text()).toContain("Saldo añadido correctamente ✔");
  });

  it("en caso de error muestra mensaje de error", async () => {
    postMock.mockRejectedValueOnce(new Error("fail"));

    const wrapper = mount(PlataformaPagoView);

    const input = wrapper.get("input");
    await input.setValue("20");

    const btn = wrapper.get(".btn-pay");
    await btn.trigger("click");

    expect(wrapper.text()).toContain("Error al añadir saldo.");
  });

  it("botón volver navega a cuenta", async () => {
    const wrapper = mount(PlataformaPagoView);

    const btnBack = wrapper.get(".back-btn");
    await btnBack.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({ name: "cuenta" });
  });
});
