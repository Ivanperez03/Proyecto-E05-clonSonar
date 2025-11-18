<template>
  <div class="dashboard">
    <div class="watermark"></div>

    <!-- TOP BAR -->
    <header class="topbar animate-fade">
      <div class="title-area">
        <h2 class="title">Panel Fragments</h2>
        <p class="subtitle">Bienvenido, {{ auth.nombre || "usuario" }} 👋</p>
      </div>

      <div class="actions">
        <button class="btn secondary" @click="irCuenta">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
          </svg>
          Mi cuenta
        </button>

        <button class="btn secondary" @click="irAdmin">
          <span class="iconify">⚙️</span>
          Admin
        </button>

        <button class="btn logout" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9" />
          </svg>
          Salir
        </button>
      </div>
    </header>

    <!-- TARJETAS PRINCIPALES -->
    <section class="cards animate-fade-delayed">
      <article class="card float">
        <h2 class="card-title">Buscar planes</h2>
        <p class="card-text">Encuentra suscripciones compartidas activas.</p>
        <button class="btn small" @click="irBuscador">Explorar</button>
      </article>

      <article class="card float">
        <h2 class="card-title">Crear planes</h2>
        <p class="card-text">Publica tu oferta para otros usuarios.</p>
        <button class="btn small" @click="irOfertas">Crear</button>
      </article>
    </section>

    <!-- PLATAFORMAS -->
    <section class="plataformas animate-fade-delayed2">
      <h3 class="plat-title">Plataformas disponibles</h3>

      <div class="plataformas-grid">
        <div
          v-for="(plataforma, i) in plataformas"
          :key="i"
          class="plataforma-card float"
        >
          <h4>{{ plataforma.nombre }}</h4>
          <p class="desc">{{ plataforma.descripcion }}</p>

          <button class="btn small" @click="verPlataforma(plataforma.id)">
            Ver detalles
          </button>
        </div>
      </div>
    </section>

    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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
  { id: 5, nombre: "Prime Video", descripcion: "Plan anual con envío gratis." }
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

function irCuenta() { router.push({ name: "cuenta" }); }
function irBuscador() { router.push({ name: "buscador" }); }
function irOfertas() { router.push({ name: "ofertar" }); }
function irAdmin() { router.push({ name: "admin" }); }
function verPlataforma(id: number) {
  router.push({ name: "plataforma-detalle", params: { id } });
}
</script>

<style>
/* === CONTENEDOR GENERAL === */
.dashboard {
  min-height: 100vh;
  padding: 2rem;
  background: radial-gradient(circle at top left, #4e54c8, #353a7a 70%);
  color: white;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* === TOPBAR === */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
}

.subtitle {
  opacity: 0.85;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 0.6rem;
}

/* === BOTONES === */
.btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  border: none;
  cursor: pointer;
  border-radius: 0.6rem;
  padding: 0.6rem 1rem;
  font-weight: 600;
  transition: 0.25s;
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  backdrop-filter: blur(6px);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px) scale(1.03);
}

.btn.logout {
  background: #ef4444;
  color: white;
}

.btn.logout:hover {
  background: #d62828;
  transform: translateY(-3px) scale(1.03);
}

.iconify {
  font-size: 1.2rem;
}

/* === CARDS PRINCIPALES === */
.cards {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.card {
  flex: 1;
  min-width: 230px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1.7rem;
  border-radius: 1.2rem;
  text-align: center;
  backdrop-filter: blur(12px);
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
}

.card-text {
  opacity: 0.9;
  margin-bottom: 1rem;
}

/* === PLATAFORMAS === */
.plataformas {
  background: rgba(255, 255, 255, 0.12);
  padding: 1.5rem;
  border-radius: 1.2rem;
  backdrop-filter: blur(10px);
}

.plat-title {
  margin-bottom: 1rem;
  font-weight: 700;
}

.plataformas-grid {
  display: grid;
  margin-top: 1rem;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
}

.plataforma-card {
  background: rgba(255, 255, 255, 0.20);
  padding: 1rem;
  border-radius: 1rem;
  transition: 0.3s ease;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.desc {
  opacity: 0.9;
  margin-bottom: 0.7rem;
}

/* === EFECTO FLOTANTE === */
.float {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.float:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

/* === ANIMACIONES === */
.animate-fade {
  animation: fadeIn 0.4s ease;
}

.animate-fade-delayed {
  animation: fadeIn 0.6s ease;
}

.animate-fade-delayed2 {
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn.small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}


.watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  background-image: url('@/assets/new_logo_Fragments.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  opacity: 0.18;       /* intensidad de la marca de agua */
  pointer-events: none; /* no bloquea clics */
  z-index: 1;
  filter: blur(0.5px);
}

.dashboard {
  position: relative;
  z-index: 2; /* asegura que todo el contenido esté encima */
}

</style>

