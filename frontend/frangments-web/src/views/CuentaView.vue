<template>
  <div class="cuenta">
    <header class="header">
      <h2>Mi cuenta</h2>
      <p class="subtitle">
        Información personal de {{ auth.user?.nombre || "usuario" }}
      </p>
    </header>

    <section class="info">
      <div class="info-item">
        <label>Nombre</label>
        <p>{{ auth.user?.nombre || "No disponible" }}</p>
      </div>

      <div class="info-item">
        <label>Email</label>
        <p>{{ auth.user?.email || "No disponible" }}</p>
      </div>

      <div class="info-item">
        <label>Teléfono</label>
        <p>{{ auth.user?.telefono || "No disponible" }}</p>
      </div>

      <div class="info-item">
        <label>Saldo</label>
        <p>
          {{ account.loading ? "Cargando..." : account.saldo + " €" }}
        </p>
      </div>
    </section>

    <section class="extra">
      <!-- PANEL DE GRUPOS -->
      <div class="panel">
        <h3>Grupos</h3>

        <ul>
          <li
            v-for="grupo in account.grupos"
            :key="grupo.nombre"
          >
            {{ grupo.nombre }}
          </li>
          <li v-if="account.grupos.length === 0">
            No perteneces a ningún grupo.
          </li>
        </ul>

        <div v-if="!creandoGrupo" class="crear-grupo">
          <button class="btn crear" @click="creandoGrupo = true">
            ➕ Crear grupo
          </button>
        </div>

        <div v-else class="nuevo-grupo">
          <input
            v-model="nuevoGrupo"
            type="text"
            placeholder="Nombre del nuevo grupo"
            class="input-grupo"
          />
          <div class="acciones-grupo">
            <button class="btn confirmar" @click="crearGrupo">✅ Crear</button>
            <button class="btn cancelar" @click="cancelarCreacion">
              ❌ Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- PANEL DE SUSCRIPCIONES -->
      <div class="panel">
        <h3>Suscripciones activas</h3>
        <ul>
          <li
            v-for="sub in account.suscripciones"
            :key="sub.id"
          >
            <!-- Ajusta según lo que devuelva tu SQL -->
            {{ sub.nombre }} –
            {{ sub.precio }}€,
            vence el {{ sub.fechaVencimiento }}
          </li>
          <li v-if="account.suscripciones.length === 0">
            No tienes suscripciones activas.
          </li>
        </ul>
      </div>
    </section>

    <div class="acciones">
      <button class="btn secondary" @click="volverDashboard">
        Volver al panel
      </button>
      <button class="btn logout" @click="logout">
        Cerrar sesión
      </button>
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
</script>

<style scoped>
.cuenta {
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff, #8ca6f7);
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  color: #1f2937;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitle {
  color: #374151;
  font-size: 0.95rem;
}

.info {
  background: rgba(255, 255, 255, 0.4);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.info-item {
  margin-bottom: 1.5rem;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.info-item p {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #111827;
  font-size: 0.95rem;
}

.extra {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
}

.panel {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 1rem;
  padding: 1.5rem;
  flex: 1;
  min-width: 260px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.panel h3 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.panel ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.panel li {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  margin-bottom: 0.5rem;
}

/* === NUEVOS ESTILOS PARA CREAR GRUPO === */
.crear-grupo {
  text-align: center;
  margin-top: 1rem;
}

.btn.crear {
  background: #4b6cb7;
  color: #fff;
}

.btn.crear:hover {
  background: #3c5aa6;
}

.nuevo-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.input-grupo {
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  outline: none;
}

.acciones-grupo {
  display: flex;
  justify-content: space-between;
}

.btn.confirmar {
  background: #16a34a;
  color: #fff;
}

.btn.confirmar:hover {
  background: #15803d;
}

.btn.cancelar {
  background: #9ca3af;
  color: #fff;
}

.btn.cancelar:hover {
  background: #6b7280;
}

.acciones {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.6rem 1.2rem;
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
</style>

