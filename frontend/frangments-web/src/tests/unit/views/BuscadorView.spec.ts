import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BuscadorView from "@/views/BuscadorView.vue";

const pushMock = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("BuscadorView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra todas las plataformas por defecto", () => {
    const wrapper = mount(BuscadorView);
    const cards = wrapper.findAll(".plataforma-card");
    // según tu lista fija deberían ser 7
    expect(cards.length).toBe(7);
  });

  it("filtra por texto en el input de búsqueda", async () => {
    const wrapper = mount(BuscadorView);

    const input = wrapper.get("input");
    await input.setValue("spotify");

    const cards = wrapper.findAll(".plataforma-card");
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toContain("Spotify");
  });

  it("filtra por categoría al pulsar un filtro", async () => {
    const wrapper = mount(BuscadorView);

    const streamingBtn = wrapper
      .findAll(".filter-btn")
      .find((b) => b.text() === "Streaming")!;
    await streamingBtn.trigger("click");

    const cards = wrapper.findAll(".plataforma-card");
    // Disney+, HBO Max, Prime Video, Crunchyroll => 4
    expect(cards.length).toBe(4);
  });

  it("al pulsar Consultar navega a la vista de planes con los params correctos", async () => {
    const wrapper = mount(BuscadorView);

    const firstCardBtn = wrapper.get(".plataforma-card .btn.detalle");
    const firstCardText = wrapper.get(".plataforma-card .plat-info h3").text();

    await firstCardBtn.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({
      name: "planes-plataforma",
      params: expect.objectContaining({
        plataforma: firstCardText,
      }),
    });
  });

  it("botón Volver redirige a dashboard", async () => {
    const wrapper = mount(BuscadorView);
    await wrapper.get(".btn.back").trigger("click");
    expect(pushMock).toHaveBeenCalledWith({ name: "dashboard" });
  });
});
