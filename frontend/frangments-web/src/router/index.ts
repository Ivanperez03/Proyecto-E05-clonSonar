import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/Dashboard.vue";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/RegisterView.vue";
import CuentaView from "@/views/CuentaView.vue";
import BuscadorView from "@/views/BuscadorView.vue"; 
import OfertarView from "@/views/OfertarView.vue";
import AdminView from "@/views/AdminView.vue";
import PlataformaPagoView from "@/views/PlataformaPagoView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/dashboard", name: "dashboard", component: DashboardView, meta: { requiresAuth: true } },
    { path: "/login", name: "login", component: LoginView, meta: { guestOnly: true } },
    { path: "/register", name: "register", component: RegisterView, meta: { guestOnly: true } },
    { path: "/cuenta", name: "cuenta", component: CuentaView, meta: { requiresAuth: true } },
    { path: "/buscador", name: "buscador", component: BuscadorView, meta: { requiresAuth: true } },
    { path: "/ofertar", name: "ofertar", component: OfertarView, meta: { requiresAuth: true } },
    { path: "/admin", name: "admin", component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: "/plataformapago", name: "plataformapago", component: PlataformaPagoView, meta: { requiresAuth: true} },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Rehidrata desde la cookie si no hay usuario
  if (!auth.user) {
    try { await auth.fetchMe(); } catch {}
  }

  if (to.meta?.requiresAuth && !auth.isAuthenticated) return { name: "login" };
  if (to.meta?.guestOnly && auth.isAuthenticated && to.name !== "register") return { name: "dashboard" };
  if (to.meta?.requiresAdmin && !auth.isAdmin) return { name: "dashboard" };

  return true;
});

export default router;
