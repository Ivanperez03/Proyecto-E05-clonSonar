import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import PlanesPlataformaView from "@/views/PlanesPlataformaView.vue";

// --- mocks router / route ---
const pushMock = vi.fn();
let routeParams: any = {
  id_plataforma: "1",
  plataforma: "HBO Max",
};

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useRoute: () => ({
    params: routeParams,
  }),
}));

// --- mock store planesPlataforma ---
const planesRef = ref<any[]>([]);
const loadingRef = ref(false);
const errorRef = ref<string | null>(null);
const cargarPlanesMock = vi.fn();
const unirseMock = vi.fn();

vi.mock("@/stores/planesPlataforma", () => ({
  usePlanesPlataformaStore: () => ({
    planes: planesRef,
    loading: loadingRef,
    error: errorRef,
    cargarPlanes: cargarPlanesMock,
    unirse: unirseMock,
  }),
}));

// storeToRefs devuelve lo mismo (ya son refs)
vi.mock("pinia", async () => {
  const actual = await vi.importActual<any>("pinia");
  return {
    ...actual,
    storeToRefs: (store: any) => ({
      planes: store.planes,
      loading: store.loading,
      error: store.error,
    }),
  };
});

describe("PlanesPlataformaView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    planesRef.value = [];
    loadingRef.value = false;
    errorRef.value = null;
    routeParams = {
      id_plataforma: "1",
      plataforma: "HBO Max",
    };
    // evitamos alert real
    vi.stubGlobal("alert", vi.fn());
  });

  it("llama a cargarPlanes con el id de la ruta al montar", async () => {
    mount(PlanesPlataformaView);
    await flushPromises();

    expect(cargarPlanesMock).toHaveBeenCalledWith(1);
  });

  it("muestra estado de carga cuando loading = true", async () => {
    loadingRef.value = true;
    const wrapper = mount(PlanesPlataformaView);
    await flushPromises();

    expect(wrapper.text()).toContain("Cargando planes...");
  });

  it("muestra mensaje de error cuando error tiene contenido", async () => {
    errorRef.value = "Error al cargar";
    const wrapper = mount(PlanesPlataformaView);
    await flushPromises();

    expect(wrapper.text()).toContain("Error al cargar");
  });

  it("muestra la lista de planes cuando hay datos", async () => {
    planesRef.value = [
      {
        id_plan: 10,
        nombre_grupo: "Grupo HBO 1",
        precio_mensual: 12.5,
        fecha_vencimiento: "2025-12-31T00:00:00Z",
      },
      {
        id_plan: 11,
        nombre_grupo: "Grupo HBO 2",
        precio_mensual: 8.99,
        fecha_vencimiento: "2025-11-30T00:00:00Z",
      },
    ];

    const wrapper = mount(PlanesPlataformaView);
    await flushPromises();

    const cards = wrapper.findAll(".card-plan");
    expect(cards.length).toBe(2);
    expect(wrapper.text()).toContain("Grupo HBO 1");
    expect(wrapper.text()).toContain("Grupo HBO 2");
  });

  it("botón volver navega al buscador", async () => {
    const wrapper = mount(PlanesPlataformaView);
    await flushPromises();

    const btnVolver = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Volver"))!;
    await btnVolver.trigger("click");

    expect(pushMock).toHaveBeenCalledWith({ name: "buscador" });
  });

  it("al unirse a un plan, se llama a store.unirse con el id correcto y se muestra el mensaje", async () => {
    planesRef.value = [
      {
        id_plan: 10,
        nombre_grupo: "Grupo HBO 1",
        precio_mensual: 12.5,
        fecha_vencimiento: "2025-12-31T00:00:00Z",
      },
    ];
    (unirseMock as any).mockResolvedValueOnce({ message: "Unido correctamente" });

    const wrapper = mount(PlanesPlataformaView);
    await flushPromises();

    const btnUnirse = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Unirme al grupo"))!;
    await btnUnirse.trigger("click");

    expect(unirseMock).toHaveBeenCalledWith(10);
  });
});
