import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OfertarView from "@/views/OfertarView.vue";

const pushMock = vi.fn();

// router
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// auth store (aunque no lo uses apenas, lo importas)
vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({}),
}));

describe("OfertarView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillForm = async (wrapper: any, overrides: Partial<any> = {}) => {
    const plataforma = overrides.plataforma ?? "Netflix";
    const precio = overrides.precio ?? "9.99";
    const fecha = overrides.fecha_vencimiento ?? "2025-12-31";
    const grupo = overrides.grupo ?? "GrupoTest";

    await wrapper.find("select#plataforma").setValue(plataforma);
    const inputs = wrapper.findAll("input");
    // precio
    await inputs[0].setValue(precio);
    // fecha
    await inputs[1].setValue(fecha);
    // grupo
    await inputs[2].setValue(grupo);
  };

  it("muestra el título de publicar oferta", () => {
    const wrapper = mount(OfertarView);
    expect(wrapper.text()).toContain("Publicar una nueva oferta");
  });

  it("si faltan campos, muestra mensaje de validación y no limpia el formulario", async () => {
    const wrapper = mount(OfertarView);

    // Solo rellenamos plataforma
    await wrapper.find("select#plataforma").setValue("Netflix");

    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("Por favor, completa todos los campos.");
    // El select mantiene el valor
    expect(
      (wrapper.find("select#plataforma").element as HTMLSelectElement).value
    ).toBe("Netflix");
  });

  it("con todos los campos, muestra mensaje de éxito y limpia el formulario", async () => {
    const wrapper = mount(OfertarView);

    await fillForm(wrapper);

    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("✅ Oferta publicada con éxito.");

    // formulario limpio
    expect(
      (wrapper.find("select#plataforma").element as HTMLSelectElement).value
    ).toBe("");
    const inputs = wrapper.findAll("input");
    expect((inputs[0].element as HTMLInputElement).value).toBe("");
    expect((inputs[1].element as HTMLInputElement).value).toBe("");
    expect((inputs[2].element as HTMLInputElement).value).toBe("");
  });

  it("botón volver navega a dashboard", async () => {
    const wrapper = mount(OfertarView);

    const btnVolver = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Volver"))!;
    await btnVolver.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({ name: "dashboard" });
  });
});
