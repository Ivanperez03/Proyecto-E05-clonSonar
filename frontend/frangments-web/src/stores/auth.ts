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
    isAdmin: (s) => s.user?.tipo?.toLowerCase() === "admin"
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = "";
      try {
        // Hacer login y que devuelva token/cookies
        await authService.login(email, password);
  
        // Obtener el usuario completo (con rol) desde backend
        this.user = await authService.me();
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
