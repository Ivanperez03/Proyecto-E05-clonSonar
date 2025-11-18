import { defineStore } from "pinia";
import { planesPlataformaService } from "@/api/planesPlataforma.service";
import type { PlanPlataformaDTO } from "@/domain/planesPlataforma";

export const usePlanesPlataformaStore = defineStore("planesPlataforma", {
  state: () => ({
    planes: [] as PlanPlataformaDTO[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hayPlanes: (state) => state.planes.length > 0,
  },

  actions: {
    async cargarPlanes(id_plataforma: number) {
      this.loading = true;
      this.error = null;

      try {
        this.planes = await planesPlataformaService.getPlanesActivos(
          id_plataforma
        );
      } catch (e: any) {
        this.error =
          e?.response?.data?.message ??
          "Error al cargar los planes de la plataforma";
        this.planes = [];
      } finally {
        this.loading = false;
      }
    },

    async unirse(id_plan: number) {
      try {
        const data = await planesPlataformaService.unirseAPlan(id_plan);
        return data; // { message, id_grupo }
      } catch (e: any) {
        throw new Error(
          e?.response?.data?.message ?? "No se pudo unir al grupo"
        );
      }
    },
  },
});
