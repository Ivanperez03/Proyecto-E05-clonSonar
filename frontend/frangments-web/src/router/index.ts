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
      meta: { requiresAuth: true }, // 🔒 necesita estar logeado
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true }, // 👤 solo si NO está logeado
    },
    { 
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { guestOnly: true },
    },
  ],
});

// 🚧 Guardia de navegación global
router.beforeEach((to) => {
  const user = localStorage.getItem("user"); // simulamos sesión
  const isAuth = !!user;
  if (to.meta.requiresAuth && !isAuth) {
    // Si intenta entrar al dashboard sin estar logeado → redirige al login
    return { name: "login" };
  }
  if (to.meta.guestOnly && isAuth) {
    // Si ya está logeado y va a login o register → redirige al dashboard
    return { name: "dashboard" };
  }
  return true;
});

export default router;
