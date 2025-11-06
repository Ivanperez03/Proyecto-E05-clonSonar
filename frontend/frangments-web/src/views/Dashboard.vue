<template>
  <div class="dash">
    <header class="topbar">
      <div>
        <h2>Panel Fragments</h2>
<p class="subtitle">Bienvenido, {{ auth.nombre || "usuario" }}.</p>
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiax from "@/apiAxios";

const router = useRouter();
const auth = useAuthStore();        
const users = ref<any[]>([]);

onMounted(async () => {
  try {
    // Si por cualquier motivo llegamos aquí sin user, intenta rehidratar
    if (!auth.user) await auth.fetchMe();
    if (!auth.isAuthenticated) return router.push({ name: "login" });

    const { data } = await apiax.get("/users");
    users.value = data ?? [];
  } catch {
    router.push({ name: "login" });
  }
});

async function logout() {
  await auth.logout();
  router.push({ name: "login" });
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
