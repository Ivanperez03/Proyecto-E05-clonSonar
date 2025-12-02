import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { alertasService } from "@/api/alertas.service";
import type { Alerta } from "@/domain/alerta";

export const useAlertStore = defineStore("alertas", () => {
  const alertas = ref<Alerta[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const showDropdown = ref(false);

  const alertasNoVistas = computed(() =>
    alertas.value.filter(a => !a.vista).length
  );

  async function fetchAlertas() {
    isLoading.value = true;
    error.value = null;

    try {
      alertas.value = await alertasService.getAll();
    } catch (e) {
      error.value = "Error cargando alertas";
    } finally {
      isLoading.value = false;
    }
  }

  async function marcarTodasComoVistas() {
    try {
      await alertasService.marcarTodasVistas();
      alertas.value = alertas.value.map(a => ({ ...a, vista: true }));
    } catch {}
  }

  function toggleDropdown() {
    showDropdown.value = !showDropdown.value;
    if (showDropdown.value && alertas.value.length === 0) fetchAlertas();
  }

  return {
    alertas,
    isLoading,
    error,
    showDropdown,
    alertasNoVistas,

    fetchAlertas,
    marcarTodasComoVistas,
    toggleDropdown,
  };
});
