<template>
  <div class="cuenta">

    <!-- HEADER -->
    <header class="header animate-fade">
      <h2 class="title">Mi Cuenta</h2>
    </header>

    <!-- INFO PERSONAL -->
    <section class="info-card float animate-fade-delayed">
      <h3 class="section-title">Datos personales</h3>

      <div class="info-grid">
        <div class="info-item">
          <label>Nombre</label>
          <p>{{ auth.user?.nombre }}</p>
        </div>

        <div class="info-item">
          <label>Email</label>
          <p>{{ auth.user?.email }}</p>
        </div>

        <div class="info-item">
          <label>Teléfono</label>
          <p>{{ auth.user?.telefono || "No disponible" }}</p>
        </div>

        <div class="info-item">
          <label>Saldo</label>
          <p>{{ account.loading ? "Cargando..." : account.saldo + " €" }}</p>
        </div>
      </div>
    </section>

    <!-- GRUPOS Y SUSCRIPCIONES -->
    <section class="panels animate-fade-delayed2">

      <!-- GRUPOS -->
      <div class="panel float">
        <h3 class="section-title">Grupos</h3>

        <ul>
          <li v-for="grupo in account.grupos" :key="grupo.nombre">
            {{ grupo.nombre }}
          </li>
          <li v-if="account.grupos.length === 0">
            No perteneces a ningún grupo.
          </li>
        </ul>
      </div>

      <!-- SUSCRIPCIONES -->
      <div class="panel float">
        <h3 class="section-title">Suscripciones activas</h3>

        <ul>
          <li v-for="sub in account.suscripciones" :key="sub.id">
            {{ sub.nombre }} – {{ sub.precio }}€  
            <br />
            <span class="sub-fecha">Vence: {{ sub.fechaVencimiento }}</span>
            <br />
            <span class="sub-fecha">Próximo cobro: {{ sub.proximoCobro }}</span>
          </li>

          <li v-if="account.suscripciones.length === 0">
            No tienes suscripciones activas.
          </li>
        </ul>
      </div>
    </section>

    <!-- BOTONES ABAJO -->
    <div class="acciones-floating animate-fade-delayed3">
      <button class="btn secondary" @click="volverDashboard">⬅ Volver</button>
      <button class="btn saldo" @click="irPlataformaPago"> Añadir saldo</button>
      <button class="btn logout" @click="logout"> Cerrar sesión </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useAccountStore } from "@/stores/cuenta";
import apiax from "@/apiAxios";

const auth = useAuthStore();
const router = useRouter();
const account = useAccountStore();
const creandoGrupo = ref(false);
const nuevoGrupo = ref("");

onMounted(async () => {
  try {
    if (!auth.user) await auth.fetchMe();
    if (!auth.isAuthenticated) return router.push({ name: "login" });
    await account.userData();
  } catch (error) {
    console.error("Error cargando los datos del usuario:", error);
    router.push({ name: "login" });
  }
});

async function crearGrupo() {
  if (!nuevoGrupo.value.trim()) {
    return alert("Por favor, introduce un nombre para el grupo.");
  }
  try {
    await account.createGroup(nuevoGrupo.value);
    nuevoGrupo.value = "";
    creandoGrupo.value = false;
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    alert("Hubo un error al crear el grupo.");
  }
}

function cancelarCreacion() {
  creandoGrupo.value = false;
  nuevoGrupo.value = "";
}

async function logout() {
  await auth.logout();
  router.push({ name: "login" });
}

function volverDashboard() {
  router.push({ name: "dashboard" });
}

function irPlataformaPago() {
  router.push({ name: "plataformapago" });
}

</script>

<style scoped>
/* ===== CONTENEDOR GENERAL ===== */
.cuenta {
  min-height: 100vh;
  padding: 2.5rem 2rem 3rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

/* ===== HEADER ===== */
.header {
  text-align: center;
}

.title {
  font-size: 2.3rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.subtitle {
  font-size: 1.6rem;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.85);
}


/* ===== INFO PERSONAL ===== */
.info-card {
  width: 100%;
  max-width: 760px;
  padding: 2rem 2.2rem;
  border-radius: 1.4rem;

  background: radial-gradient(circle at top left,
    rgba(15, 23, 42, 0.8),
    rgba(15, 23, 42, 0.92)
  );
  border: 1px solid rgba(148, 163, 184, 0.5);
  box-shadow: 0 22px 40px rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(18px);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}

/* GRID de datos */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem 1.4rem;
}

.info-item label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(148, 163, 184, 0.9);
}

.info-item p {
  margin-top: 0.35rem;
  padding: 0.65rem 0.9rem;
  border-radius: 0.8rem;
  background: radial-gradient(circle at top left,
    rgba(30, 64, 175, 0.65),
    rgba(15, 23, 42, 0.9)
  );
  border: 1px solid rgba(129, 140, 248, 0.55);
  font-weight: 600;
  font-size: 0.95rem;
}

/* ===== PANELS GRUPOS / SUSCRIPCIONES ===== */
.panels {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.6rem;
}

.panel {
  padding: 1.6rem 1.7rem;
  border-radius: 1.4rem;

  background: radial-gradient(circle at top left,
    rgba(15, 23, 42, 0.9),
    rgba(15, 23, 42, 0.98)
  );
  border: 1px solid rgba(148, 163, 184, 0.55);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
}

/* listas */
.panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.panel li {
  background: rgba(30, 64, 175, 0.5);
  border-radius: 0.9rem;
  padding: 0.75rem 0.9rem;
  font-size: 0.93rem;
  border: 1px solid rgba(129, 140, 248, 0.55);
}

.panel li:last-child {
  margin-bottom: 0;
}

.sub-fecha {
  display: inline-block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: rgba(209, 213, 219, 0.9);
}

/* Crear grupo */
.panel-actions {
  margin-top: 1.1rem;
  text-align: left;
}

/* Input nuevo grupo */
.nuevo-grupo {
  margin-top: 1.1rem;
}

.input {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: 0.8rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.95);
  color: #e5e7eb;
  font-size: 0.92rem;
  outline: none;
  transition: 0.25s ease;
  box-sizing: border-box;
}

.input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}

/* Acciones crear/cancelar grupo */
.group-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.6rem;
}

/* ===== BOTONES GENERALES ===== */
.btn {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.1rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.22s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  color: #f9fafb;
}

.btn.icon {
  background: linear-gradient(135deg, #4f46e5, #22d3ee);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.6);
}

.btn.success {
  background: #22c55e;
}

.btn.danger {
  background: #9ca3af;
}

/* botones panel derecha */
.btn.secondary {
  background: rgba(148, 163, 184, 0.25);
}

.btn.saldo {
  background: #10b981;
}

.btn.logout {
  background: #ef4444;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.6);
  filter: brightness(1.03);
}

/* ===== EFECTO FLOTANTE TARJETAS ===== */
.float {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.float:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.9);
}

/* ===== ANIMACIONES ENTRADA ===== */
.animate-fade {
  animation: fadeIn 0.4s ease;
}
.animate-fade-delayed {
  animation: fadeIn 0.6s ease;
}
.animate-fade-delayed2 {
  animation: fadeIn 0.8s ease;
}
.animate-fade-delayed3 {
  animation: fadeIn 1s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ===== ACCIONES FLOTANTES DERECHA ===== */
.acciones-floating {
  position: fixed;
  right: 1.6rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 20;
}

.acciones-floating .btn {
  min-width: 160px;
  justify-content: center;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.7);
}

/* Responsive: botones abajo en móviles */
@media (max-width: 900px) {
  .cuenta {
    padding: 1.8rem 1.2rem 3.5rem;
  }

  .acciones-floating {
    position: static;
    transform: none;
    flex-direction: row;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .acciones-floating .btn {
    min-width: 0;
    flex: 1;
  }
}
</style>
