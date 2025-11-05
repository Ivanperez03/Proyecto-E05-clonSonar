import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/Dashboard.vue";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/RegisterView.vue";
import apiax from "@/apiAxios"; // ⚡ cliente Axios con cookies

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

// 🚧 Guardia global de autenticación
router.beforeEach(async (to) => {
  try {
    const { data } = await apiax.get("/users/me");
    const isAuth = !!data?.user;

    if (to.meta.requiresAuth && !isAuth) {
      // 🔒 quiere entrar a una ruta protegida sin login
      return { name: "login" };
    }

    if (to.name === "register" && isAuth) {
      // 🧹 si está logueado pero entra a "register", cerramos sesión
      try {
        await apiax.post("/users/logout");
      } catch {
        /* ignoramos error */
      }
      localStorage.removeItem("user");
      return true; // le dejamos continuar al registro
    }

    if (to.meta.guestOnly && isAuth && to.name !== "register") {
      // ⚡ si intenta ir a login estando logueado → dashboard
      return { name: "dashboard" };
    }

    return true;
  } catch {
    // 🧨 token inválido o expirado
    if (to.meta.requiresAuth) return { name: "login" };
    return true;
  }
});

export default router;
