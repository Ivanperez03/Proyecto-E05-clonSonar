import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OfertarView from "@/views/OfertarView.vue";
import apiax from "@/apiAxios";

// ---- router mock ----
const pushMock = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// ---- account store mock ----
const createGroupMock = vi.fn();

vi.mock("@/stores/cuenta", () => ({
  useAccountStore: () => ({
    createGroup: createGroupMock,
  }),
}));

// ---- apiAxios mock ----
vi.mock("@/apiAxios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("OfertarView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushMock.mockReset();

    localStorage.setItem("token", "fake-token");

    (apiax as any).get.mockReset?.();
    (apiax as any).post.mockReset?.();

    // Por defecto, /plataforma devuelve una lista
    (apiax as any).get.mockResolvedValue({
      data: [{ id_plataforma: 1, nombre: "Netflix" }],
    });
  });

  it("muestra el título de publicar oferta", async () => {
    const wrapper = mount(OfertarView);
    await flushPromises();

    expect(wrapper.text()).toContain("Publicar un nuevo plan");
    expect(wrapper.text()).toContain(
      "Crea un plan y se creará automáticamente su grupo asociado"
    );
  });

  it("si faltan campos, muestra mensaje de validación y no llama al backend", async () => {
    const wrapper = mount(OfertarView);
    await flushPromises(); // espera a que se carguen las plataformas

    // No rellenamos nada → debería dispararse la validación
    const form = wrapper.get("form");
    await form.trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Por favor completa todos los campos");
    expect(createGroupMock).not.toHaveBeenCalled();
    expect((apiax as any).post).not.toHaveBeenCalled();
  });

  it("con todos los campos, crea grupo, llama al backend y limpia el formulario", async () => {
    const wrapper = mount(OfertarView);
    await flushPromises();

    // Mock de createGroup que devuelve id_grupo
    createGroupMock.mockResolvedValue({ id_grupo: 123 });

    const selectPlataforma = wrapper.get("#plataforma");
    const inputPrecio = wrapper.get("#precio");
    const inputFecha = wrapper.get("#fecha_vencimiento");
    const inputPersonas = wrapper.get("#personas");
    const inputGrupo = wrapper.get("input[v-model='form.nuevo_grupo'], input[placeholder='Escribe el nombre del grupo']");

    // Rellenar campos
    await selectPlataforma.setValue("1");
    await inputPrecio.setValue("12.99");
    await inputFecha.setValue("2025-12-31");
    await inputPersonas.setValue("4");
    await inputGrupo.setValue("Grupo Netflix");

    (apiax as any).post.mockResolvedValue({
      data: { message: "ok" },
    });

    const form = wrapper.get("form");
    await form.trigger("submit.prevent");
    await flushPromises();

    expect(createGroupMock).toHaveBeenCalledWith("Grupo Netflix");
    expect((apiax as any).post).toHaveBeenCalledWith(
      "/plan_sub/subscribe",
      {
        id_plataforma: 1,
        precio: 12.99,
        fecha_vencimiento: "2025-12-31",
        id_grupo: 123,
        nmiembros: 4,
      },
      {
        headers: { Authorization: "Bearer fake-token" },
      }
    );

    expect(wrapper.text()).toContain("✅ Plan y grupo creado con éxito");

    // Formulario reseteado
    expect((selectPlataforma.element as HTMLSelectElement).value).toBe("");
    expect((inputPrecio.element as HTMLInputElement).value).toBe("");
    expect((inputFecha.element as HTMLInputElement).value).toBe("");
    expect((inputPersonas.element as HTMLInputElement).value).toBe("1");
  });

  it("botón volver navega a dashboard", async () => {
    const wrapper = mount(OfertarView);
    await flushPromises();

    const backBtn = wrapper.get(".btn.back");
    await backBtn.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({ name: "dashboard" });
  });
});
