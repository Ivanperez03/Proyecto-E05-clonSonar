import apiax from "@/apiAxios";
import { Alerta } from "@/domain/alerta";

export const alertasService = {
  async getAll() {
    const { data } = await apiax.get("/alertas");

    // backend devuelve array -> lo convertimos a domain models
    return Array.isArray(data)
      ? data.map((a: any) => Alerta.fromDTO(a))
      : [];
  },

  async marcarTodasVistas() {
    await apiax.post("/alertas/marcar-todas-vistas");
  },

  async marcarUnaVista(id: number) {
    const { data } = await apiax.post(`/alertas/${id}/vista`);
    return Alerta.fromDTO(data);
  },
};
