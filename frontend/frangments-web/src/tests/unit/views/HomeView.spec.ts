import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomeView from "@/views/HomeView.vue";

const pushMock = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("HomeView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el mensaje principal del hero", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.text()).toContain("Comparte gastos de streaming");
    expect(wrapper.text()).toContain("sin complicaciones");
  });

  it("botón 'Empieza ahora' navega a /register", async () => {
    const wrapper = mount(HomeView);

    const btnStart = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Empieza ahora"))!;
    await btnStart.trigger("click");

    expect(pushMock).toHaveBeenCalledWith("/register");
  });

  it("botón 'Ya tengo cuenta' navega a /login", async () => {
    const wrapper = mount(HomeView);

    const btnLogin = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Ya tengo cuenta"))!;
    await btnLogin.trigger("click");

    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
