// src/stores/admin.ts
import { defineStore } from "pinia";
import { adminService } from "@/api/admin.service";

type AdminUser = {
  id_usuario: number;
  nombre: string;
  mail: string;
  tipo: string;
  saldo?: number;
  nuevoSaldo: number | null; // lo usas en actualizarSaldo()
};

type AdminGrupo = {
  id: number;     // 👈 para que coincida con tu template (grupo.id)
  nombre: string;
};

type AdminOferta = {
  id: number;
  plataforma: string;
  precio: number;
  usuario: string;
  grupo: string;
};

type AdminState = {
  users: AdminUser[];
  grupos: AdminGrupo[];
  ofertas: AdminOferta[];
  loading: boolean;
};

export const useAdminStore = defineStore("admin", {
  state: (): AdminState => ({
    users: [],
    grupos: [],
    ofertas: [],
    loading: false,
  }),

  actions: {
    async loadAll() {
      this.loading = true;
      try {
        // Usuarios
        const usersData = await adminService.getUsers();
        this.users = (usersData ?? []).map((u: any) => ({
          ...u,
          nuevoSaldo: null,
        }));

        // Grupos (mantenemos id: g.id_grupo para tu template)
        const gruposData = await adminService.getGrupos();
        this.grupos = (gruposData ?? []).map((g: any) => ({
          ...g,
          id: g.id_grupo,
        }));

        // Ofertas
        const ofertasData = await adminService.getOfertas();
        this.ofertas = ofertasData ?? [];
      } finally {
        this.loading = false;
      }
    },

    async eliminarUsuario(id_usuario: number) {
      await adminService.deleteUser(id_usuario);
      this.users = this.users.filter((u) => u.id_usuario !== id_usuario);
    },

    async promoverUsuario(id_usuario: number) {
      await adminService.promoteUser(id_usuario);
      const user = this.users.find((u) => u.id_usuario === id_usuario);
      if (user) user.tipo = "admin";
    },

    async eliminarGrupo(id: number) {
      await adminService.deleteGrupo(id);
      this.grupos = this.grupos.filter((g) => g.id !== id);
    },

    async eliminarOferta(id: number) {
      await adminService.deleteOferta(id);
      this.ofertas = this.ofertas.filter((o) => o.id !== id);
    },

    async actualizarSaldo(user: AdminUser) {
      await adminService.updateSaldo(user.id_usuario, user.nuevoSaldo as number);
      user.saldo = user.nuevoSaldo as number;
      user.nuevoSaldo = null;
    },
  },
});
