import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/Dashboard.vue";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/RegisterView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true },
    },
    { 
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { guestOnly: true },
    },
  ],
});

import { useAuthStore } from "@/stores/auth";

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // ⬇️ Rehidrata desde la cookie llamando a /me solo si no hay user en store
  if (!auth.user) {
    try { await auth.fetchMe(); } catch { /* ignora */ }
  }

  if (to.meta?.requiresAuth && !auth.isAuthenticated) return { name: "login" };
  if (to.meta?.guestOnly && auth.isAuthenticated && to.name !== "register") return { name: "dashboard" };
  return true;
});


export default router;
