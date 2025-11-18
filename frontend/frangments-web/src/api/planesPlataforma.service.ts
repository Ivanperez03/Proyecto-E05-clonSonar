import apiax from "@/apiAxios";
import type { PlanPlataformaDTO } from "@/domain/planesPlataforma";

export const planesPlataformaService = {

  async getPlanesActivos(id_plataforma: number) {
    const { data } = await apiax.get<PlanPlataformaDTO[]>(
      `/plan_sub/plataforma/${id_plataforma}/activos`
    );
    return data; 
  },

  async unirseAPlan(id_plan: number) {
    const { data } = await apiax.post(
      `/plan_sub/${id_plan}/unirse`
    );
    return data; 
  },
};
