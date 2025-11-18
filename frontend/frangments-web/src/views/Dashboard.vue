<template>
  <div class="dashboard">
    <div class="watermark"></div>

      <!-- TOP BAR -->
  <header class="topbar animate-fade">

    <!-- IZQUIERDA -->
    <div class="header-left">
      <p class="subtitle">
        Bienvenido de vuelta, {{ auth.nombre || "usuario" }} ¿qué tienes planeado para hoy?
      </p>
    </div>

    <!-- CENTRO: LOGO -->
    <div class="header-center">
      <img src="@/assets/new_logo_Fragments.png" alt="Fragments" class="header-logo" />
    </div>

    <!-- DERECHA -->
    <div class="actions">
      <button class="btn small primary" @click="irCuenta">
        Mi cuenta
      </button>
      <button class="btn small primary" @click="irAdmin">
        Administrador
      </button>

      <button class="btn logout" @click="logout">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9" />
        </svg> Salir
      </button>
    </div>

  </header>


    <!-- TARJETAS PRINCIPALES -->
    <section class="cards animate-fade-delayed">
      <article class="card float card-main">
        <div class="card-main-header">
          <div class="card-icon">
            🔍
          </div>
          <div>
            <h2 class="card-title">Buscar planes</h2>
            <p class="card-text">Encuentra suscripciones compartidas activas y únete en segundos.</p>
          </div>
        </div>

        <div class="card-main-footer">
          <div class="pills">
            <span class="pill">Planes verificados</span>
            <span class="pill pill-soft">Pagos repartidos</span>
          </div>
          <button class="btn small primary" @click="irBuscador">
            Explorar planes
          </button>
        </div>
      </article>

      <article class="card float card-main">
        <div class="card-main-header">
          <div class="card-icon secondary-icon">
            ➕
          </div>
          <div>
            <h2 class="card-title">Crear planes</h2>
            <p class="card-text">Publica tu oferta y comparte los gastos con otros usuarios.</p>
          </div>
        </div>

        <div class="card-main-footer">
          <div class="pills">
            <span class="pill">Control total</span>
            <span class="pill pill-soft">Cupos limitados</span>
          </div>
          <button class="btn small primary" @click="irOfertas">
            Crear plan
          </button>
        </div>
      </article>
    </section>

    <!-- PLATAFORMAS -->
    <section class="plataformas animate-fade-delayed2">
      <div class="plat-header">
        <div>
          <h3 class="plat-title">Plataformas disponibles</h3>
          <p class="plat-subtitle">Gestiona tus cuentas compartidas de streaming desde un único panel.</p>
        </div>
      </div>

      <div class="plataformas-grid">
        <div
          v-for="(plataforma, i) in plataformas"
          :key="i"
          class="plataforma-card float"
          @click="verPlataforma(plataforma.id)"
        >
          <div class="plat-main">
            <div class="plat-logo" :data-initial="plataforma.nombre.charAt(0)">
              <!-- inicial como “logo” -->
            </div>

            <div class="plat-info">
              <h4 class="plat-name">{{ plataforma.nombre }}</h4>
            </div>
          </div>

          <div class="plat-actions">
            <button
              class="btn small ghost"
              @click.stop="verPlataforma(plataforma.id)"
            >
              Ver detalles
            </button>
          </div>
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
  { id: 1, nombre: "HBO Max", descripcion: "Compartes tu cuenta con 3 personas." },
  { id: 2, nombre: "Spotify", descripcion: "Plan familiar activo." },
  { id: 3, nombre: "Disney+", descripcion: "Suscripción mensual compartida." },
  { id: 4, nombre: "Xbox Game Pass", descripcion: "aaa." },
  { id: 5, nombre: "Canva Pro", descripcion: "aaaa" },
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
  router.push({ name: "home" });
}

function irCuenta() {
  router.push({ name: "cuenta" }); 
}

function irBuscador() {
  router.push({ name: "buscador" }); 
}

function irOfertas() {
  router.push({ name: "ofertar" }); 
}

function irAdmin() {
  router.push({ name: "admin" }); 
}

function verPlataforma(id: number) {
  router.push({ name: "plataforma-detalle", params: { id } });
}
</script>

<style>
/* === CONTENEDOR GENERAL === */
.dashboard {
  position: relative;
  min-height: 100vh;
  padding: 1.25rem 2rem 2rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  color: #f9fafb;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.75rem; 
  overflow: hidden;
}

.dashboard > *:not(.watermark) {
  position: relative;
  z-index: 2;
}

/* === TOPBAR === */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-logo {
  width: 200px;     
  height: auto;
  opacity: 0.9;
}

.title-area {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.75;
}

.title {
  font-size: 2.1rem;
  font-weight: 700;
}

.subtitle {
  opacity: 0.9;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

/* === BOTONES === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border: none;
  cursor: pointer;
  border-radius: 0.8rem;
  padding: 0.6rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: 0.25s;
  background: rgba(15, 23, 42, 0.4);
  color: #e5e7eb;
  backdrop-filter: blur(10px);
}

.btn .icon {
  width: 18px;
  height: 18px;
}

.btn.secondary {
  background: rgba(15, 23, 42, 0.55);
}

.btn.secondary:hover {
  background: rgba(15, 23, 42, 0.85);
  transform: translateY(-2px) scale(1.02);
}

.btn.logout {
  background: var(--danger, #e11d48);
  color: white;
}

.btn.logout:hover {
  background: #be123c;
  transform: translateY(-2px) scale(1.02);
}

.btn.small {
  padding: 0.4rem 0.9rem;
  font-size: 0.82rem;
  border-radius: 999px;
}

.btn.primary {
  background: linear-gradient(135deg, #4f46e5, #22d3ee);
  color: white;
}

.btn.primary:hover {
  filter: brightness(1.08);
  transform: translateY(-2px) scale(1.02);
}

.btn.ghost {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.7);
  color: #e5e7eb;
}

.btn.ghost:hover {
  background: rgba(15, 23, 42, 0.7);
  border-color: #e5e7eb;
}

/* === CARDS PRINCIPALES === */
.cards {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.card {
  flex: 1;
  min-width: 260px;
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7));
  border: 1px solid rgba(148, 163, 184, 0.35);
  padding: 1.7rem 1.8rem;
  border-radius: 1.4rem;
  backdrop-filter: blur(16px);
}

/* layout más “dashboard” */
.card-main {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.card-main-header {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: radial-gradient(circle at 30% 20%, #22d3ee, #4f46e5);
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.6);
}

.secondary-icon {
  background: radial-gradient(circle at 30% 20%, #a855f7, #ec4899);
  box-shadow: 0 0 25px rgba(236, 72, 153, 0.6);
}

.card-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.card-text {
  opacity: 0.9;
  font-size: 0.92rem;
}

.card-main-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.pill {
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.7);
}

.pill-soft {
  background: rgba(56, 189, 248, 0.12);
  border-color: rgba(56, 189, 248, 0.7);
}

/* === PLATAFORMAS === */
.plataformas {
  background: rgba(15, 23, 42, 0.8);
  padding: 1.6rem 1.5rem 1.8rem;
  border-radius: 1.4rem;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.33);
}

.plat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.plat-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.05rem;
}

.plat-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

.badge-soft {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.6);
}

/* GRID PLATAFORMAS */
.plataformas-grid {
  display: grid;
  margin-top: 1.3rem;
  gap: 1rem;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  justify-items: center; 
}


.plataforma-card {
  background: radial-gradient(circle at top left, rgba(30, 64, 175, 0.9), rgba(15, 23, 42, 0.9));
  padding: 0.9rem 1rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(129, 140, 248, 0.35);
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.plataforma-card::before {
  content: "";
  position: absolute;
  inset: -60%;
  background: radial-gradient(circle at top left, rgba(96, 165, 250, 0.25), transparent 60%);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.plataforma-card:hover::before {
  opacity: 1;
}

.plat-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1;
}

.plat-actions {
  z-index: 1;
}

/* “Logo” circular con inicial */
.plat-logo {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #facc15, #f97316);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 18px rgba(248, 250, 252, 0.45);
  font-weight: 700;
  font-size: 1rem;
  color: #0f172a;
  position: relative;
}

.plat-logo::after {
  content: attr(data-initial);
}

.plat-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

/* === EFECTO FLOTANTE === */
.float {
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.float:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.6);
  border-color: rgba(129, 140, 248, 0.8);
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
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .dashboard {
    padding: 1.5rem 1.2rem 2.5rem;
  }

  .cards {
    flex-direction: column;
  }

  .card-main-footer {
    align-items: flex-start;
  }
}

.header-left .subtitle {
  font-size: 1.05rem;             
  font-weight: 500;                
  color: rgba(15, 23, 42, 0.8);    
  letter-spacing: 0.3px;          
  text-shadow: 0 1px 2px rgba(255,255,255,0.6);
  backdrop-filter: blur(1px);      
  padding: 0.2rem 0;                
}

.hero-kicker {
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.7);
}

</style>

