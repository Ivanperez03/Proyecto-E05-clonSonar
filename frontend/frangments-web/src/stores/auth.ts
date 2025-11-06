// src/stores/auth.ts
import { defineStore } from "pinia";
import { authService } from "@/api/auth.service";
import { User } from "@/domain/user";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({ user: null, loading: false, error: "" }),
  getters: {
    isAuthenticated: (s) => !!s.user,
    nombre: (s) => s.user?.nombre ?? "",
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true; this.error = "";
      try {
        this.user = await authService.login(email, password);
      } catch (e: any) {
        this.error = e?.response?.data?.message ?? "Error iniciando sesión";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      try { this.user = await authService.me(); }
      catch { this.user = null; }
    },
    async logout() {
      try { await authService.logout(); } finally { this.user = null; }
    },
  },
});
