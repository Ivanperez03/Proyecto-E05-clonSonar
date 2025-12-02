// src/api/admin.service.ts
import apiax from "@/apiAxios";

export const adminService = {
  async getUsers() {
    const { data } = await apiax.get("/admin/usuarios");
    return data;
  },

  async getGrupos() {
    const { data } = await apiax.get("/admin/grupos");
    return data;
  },

  async getOfertas() {
    const { data } = await apiax.get("/admin/ofertas");
    return data;
  },

  async deleteUser(id_usuario: number) {
    await apiax.delete(`/admin/usuarios/${id_usuario}`);
  },

  async promoteUser(id_usuario: number) {
    await apiax.post(`/admin/usuarios/${id_usuario}/promover`);
  },

  async deleteGrupo(id: number) {
    await apiax.delete(`/admin/grupos/${id}`);
  },

  async deleteOferta(id: number) {
    await apiax.delete(`/admin/ofertas/${id}`);
  },

  async updateSaldo(id_usuario: number, saldo: number) {
    await apiax.put(`/admin/usuarios/${id_usuario}/saldo`, { saldo });
  },
};
