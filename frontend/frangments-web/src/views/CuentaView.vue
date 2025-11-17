<template>
  <div class="cuenta">

    <!-- HEADER -->
    <header class="header animate-fade">
      <h2 class="title">Mi Cuenta</h2>
      <p class="subtitle">Información personal de {{ auth.user?.nombre }}</p>
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

        <!-- Crear grupo -->
        <div v-if="!creandoGrupo" class="panel-actions">
          <button class="btn icon" @click="creandoGrupo = true">
            + Crear grupo
          </button>
        </div>

        <div v-else class="nuevo-grupo">
          <input
            v-model="nuevoGrupo"
            type="text"
            placeholder="Nuevo grupo"
            class="input"
          />
          <div class="group-actions">
            <button class="btn success" @click="crearGrupo">Crear</button>
            <button class="btn danger" @click="cancelarCreacion">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- SUSCRIPCIONES -->
      <div class="panel float">
        <h3 class="section-title">Suscripciones activas</h3>

        <ul>
          <li v-for="sub in account.suscripciones" :key="sub.id">
            {{ sub.nombre }} – {{ sub.precio }}€  
            <br />
            <span class="sub-fecha">Vence: {{ sub.fechaVencimiento }}</span>
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
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAccountStore } from "@/stores/cuenta";

const router = useRouter();
const auth = useAuthStore();
const account = useAccountStore();

const creandoGrupo = ref(false);
const nuevoGrupo = ref("");

onMounted(async () => {
  if (!auth.user) await auth.fetchMe();
  if (!auth.isAuthenticated) return router.push({ name: "login" });
  await account.userData();
});

async function crearGrupo() {
  if (!nuevoGrupo.value.trim()) return alert("Introduce un nombre.");
  try {
    await account.createGroup(nuevoGrupo.value);
    nuevoGrupo.value = "";
    creandoGrupo.value = false;
  } catch {
    alert("Error al crear el grupo.");
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
/* === CONTENEDOR GENERAL === */
.cuenta {
  min-height: 100vh;
  padding: 2rem;
  background: radial-gradient(circle at top left, #4e54c8, #353a7a 70%);
  color: white;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

/* === HEADER === */
.header {
  text-align: center;
}

.title {
  font-size: 2.3rem;
  font-weight: 700;
}

.subtitle {
  opacity: 0.85;
  margin-top: 0.25rem;
}

/* === INFO CARD === */
.info-card {
  width: 100%;
  max-width: 580px;
  padding: 2rem;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(14px);
  border-radius: 1.2rem;
  border: 1px solid rgba(255,255,255,0.2);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.4rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.2rem;
}

.info-item label {
  font-size: 0.85rem;
  opacity: 0.85;
}

.info-item p {
  margin-top: 0.3rem;
  background: rgba(255,255,255,0.2);
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  font-weight: 600;
}

/* === PANELS (Grupos / Suscripciones) === */
.panels {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
}

.panel {
  flex: 1;
  min-width: 280px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  padding: 1.5rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(255,255,255,0.2);
}

.panel ul {
  padding: 0;
  list-style: none;
}

.panel li {
  background: rgba(255,255,255,0.18);
  padding: 0.7rem 1rem;
  border-radius: 0.6rem;
  margin-bottom: 0.6rem;
}

.sub-fecha {
  opacity: 0.8;
  font-size: 0.85rem;
}

.panel-actions {
  margin-top: 1rem;
  text-align: center;
}

/* Inputs */
.input {
  padding: 0.6rem;
  width: 100%;
  border-radius: 0.6rem;
  border: none;
  outline: none;
  margin-bottom: 0.5rem;
}

.group-actions {
  display: flex;
  justify-content: space-between;
}

/* === BOTONES === */
.btn {
  border: none;
  border-radius: 0.6rem;
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
}

.btn.icon {
  background: rgba(255,255,255,0.2);
  color: white;
}

.btn.secondary {
  background: rgba(255,255,255,0.25);
}

.btn.saldo {
  background: #10b981;
}

.btn.logout {
  background: #ef4444;
}

.btn.success {
  background: #22c55e;
}

.btn.danger {
  background: #9ca3af;
}

.btn:hover {
  transform: translateY(-4px);
  opacity: 0.9;
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

.animate-fade-delayed3 {
  animation: fadeIn 1s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* === NUEVA BARRA DE ACCIONES === */
.acciones-fijas {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  max-width: 700px;

  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(14px);
  padding: 1rem 1.5rem;
  border-radius: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.6s ease;
}

.btn {
  flex: 1;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.9rem;
  border: none;
  cursor: pointer;
  transition: 0.25s ease;
}

/* Volver */
.btn.volver {
  background: rgba(255, 255, 255, 0.22);
  color: white;
}

/* Acción principal: añadir saldo */
.btn.saldo-principal {
  background: #10b981;
  color: white;
  font-weight: 700;
}

/* Cerrar sesión */
.btn.cerrar {
  background: #ef4444;
  color: white;
}

/* Hover general */
.btn:hover {
  transform: translateY(-4px);
  opacity: 0.95;
}

/* Animación suave */
@keyframes slideUp {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

/* === SIDE FLOATING BAR === */
.acciones-floating {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  z-index: 999;
}

/* Botones flotantes */
.btn-float {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  cursor: pointer;

  font-size: 1.35rem;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(14px);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18);

  transition: all 0.25s ease;
}

/* Hover con salto suave */
.btn-float:hover {
  transform: translateY(-3px) scale(1.08);
  background: rgba(255, 255, 255, 0.4);
}

/* Colores específicos */
.btn-float.volver {
  color: #2563eb; /* azul */
}

.btn-float.saldo {
  color: #059669; /* verde */
  font-size: 1.45rem;
}

.btn-float.logout {
  color: #dc2626; /* rojo */
}

/* Animación de aparición */
.acciones-floating {
  animation: slideInRight 0.6s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translate(40px, -50%);
  }
  to {
    opacity: 1;
    transform: translate(0, -50%);
  }
}
</style>
