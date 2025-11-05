<template>
  <div class="dash">
    <header class="topbar">
      <div>
        <h2>Panel Fragments</h2>
        <p class="subtitle">Bienvenido, {{ user?.nombre || "usuario" }}.</p>
      </div>
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </header>

    <section class="cards">
      <article class="card">
        <h3>Usuarios</h3>
        <p>{{ users.length }}</p>
      </article>
      <article class="card">
        <h3>Grupos</h3>
        <p>0</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import apiax from "../apiAxios"; // ✅ cliente axios configurado con cookies

const router = useRouter();
const user = ref<any>(null);
const users = ref<any[]>([]);
let checkInterval: any = null;

// 🔹 Cargar datos protegidos y verificar sesión
onMounted(async () => {
  try {
    const { data: userData } = await apiax.get("/users/me");
    user.value = userData.user;

    const { data: usersData } = await apiax.get("/users");
    users.value = usersData;
  } catch (err) {
    console.error("Error cargando datos:", err);
    router.push({ name: "login" });
  }

  // 🕒 Comprobar token cada 30 segundos
  checkInterval = setInterval(checkSession, 30000);
});

onUnmounted(() => {
  if (checkInterval) clearInterval(checkInterval);
});

// 🔒 Verifica si el token sigue siendo válido
async function checkSession() {
  try {
    await apiax.get("/users/me");
  } catch (err: any) {
    if (err.response?.status === 401) {
      console.warn("⚠️ Token expirado. Cerrando sesión...");
      logout();
    }
  }
}

// 🚪 Logout (también se usa al expirar el token)
async function logout() {
  try {
    await apiax.post("/users/logout"); // si no existe el endpoint, no pasa nada
  } catch {
    // ignoramos errores
  } finally {
    localStorage.removeItem("user");
    router.push({ name: "login" });
  }
}
</script>

<style scoped>
.dash { padding: 2rem; }

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.subtitle { color: #94a3b8; margin-top: .25rem; }

.cards { display: flex; gap: 1rem; }

.card {
  background: #1f2937;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  min-width: 180px;
}

.logout-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: .6rem 1rem;
  border-radius: .5rem;
  font-weight: 600;
  cursor: pointer;
}
.logout-btn:hover { background: #dc2626; }
</style>
