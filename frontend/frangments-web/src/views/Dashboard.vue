<!--<template>
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
-->
<template>
  <div class="dash">
    <header class="topbar">
      <div>
        <h2>Panel Fragments</h2>
        <p class="subtitle">Bienvenido, {{ auth.nombre || "usuario" }}.</p>
      </div>

      <div class="actions">
        <button class="btn secondary" @click="irCuenta">Mi cuenta</button>
        <!--<button class="btn secondary" @click="irBuscador">Buscar plataformas</button>
        <button class="btn secondary" @click="irOfertas">Ofertas</button>-->
        <button class="btn logout" @click="logout">Cerrar sesión</button>
      </div>
    </header>

    <section class="cards">
      <article class="card">
        <h2>Buscar planes</h2> 
        <button class="btn small" @click="irBuscador">Ir</button>
      </article>

      <article class="card">
        <h2>Crear planes</h2>
        <button class="btn small" @click="irOfertas">Ir</button>
      </article>
    </section>

    <section class="plataformas">
      <h3>Mis plataformas</h3>
      <div class="plataformas-grid">
        <div v-for="(plataforma, i) in plataformas" :key="i" class="plataforma-card">
          <h4>{{ plataforma.nombre }}</h4>
          <p>{{ plataforma.descripcion }}</p>
          <button class="btn small" @click="verPlataforma(plataforma.id)">Ver detalles</button>
        </div>
      </div>
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
const plataformas = ref([
  { id: 1, nombre: "Netflix", descripcion: "Compartes tu cuenta con 3 personas." },
  { id: 2, nombre: "Spotify", descripcion: "Plan familiar activo." },
  { id: 3, nombre: "Disney+", descripcion: "Suscripción mensual compartida." },
  { id: 4, nombre: "HBO Max", descripcion: "Cuenta Premium." },
  { id: 5, nombre: "Prime Video", descripcion: "Plan anual con envío gratis." },
]);

onMounted(async () => {
  try {
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

function irCuenta() {
  router.push({ name: "cuenta" }); // define esta ruta en tu router
}

function irBuscador() {
  router.push({ name: "buscador" }); // define esta ruta en tu router
}

function irOfertas() {
  router.push({ name: "ofertas" }); // define esta ruta en tu router
}

function verPlataforma(id: number) {
  router.push({ name: "plataforma-detalle", params: { id } });
}
</script>

<style scoped>
.dash {
  padding: 2rem;
  color: #241272;
  background: linear-gradient(135deg, #dde0eb, #7593ec);
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.subtitle {
  color: #374151;
  margin-top: 0.25rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn.secondary {
  background: #4b6cb7;
  color: #fff;
}

.btn.secondary:hover {
  background: #3c5aa6;
}

.btn.logout {
  background: #ef4444;
  color: #fff;
}

.btn.logout:hover {
  background: #dc2626;
}

.cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  background: #6b87ad;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  color: rgb(0, 0, 0);
  min-width: 180px;
  flex: 1;
  text-align: center;
}

.plataformas {
  background: rgba(255, 255, 255, 0.3);
  padding: 1rem;
  border-radius: 1rem;
}

.plataformas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.plataforma-card {
  background: #1f2937;
  padding: 1rem;
  border-radius: 1rem;
  color: #fff;
  text-align: center;
  transition: transform 0.2s ease;
}

.plataforma-card:hover {
  transform: translateY(-4px);
}

.btn.small {
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}
</style>
