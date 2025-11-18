<template>
  <div class="admin">
    <!-- HEADER -->
    <header class="header">
      <h2 class="title">Panel de Administración</h2>
      <p class="subtitle">Gestión de usuarios, grupos y ofertas</p>
    </header>

    <!-- BOTONES TIPO DASHBOARD -->
    <nav class="acciones-globales">
      <button
        class="btn-glossy"
        :class="{ active: seccionActiva === 'usuarios' }"
        @click="seccionActiva = 'usuarios'"
      >
        Usuarios
      </button>

      <button
        class="btn-glossy"
        :class="{ active: seccionActiva === 'grupos' }"
        @click="seccionActiva = 'grupos'"
      >
        Grupos
      </button>

      <button
        class="btn-glossy"
        :class="{ active: seccionActiva === 'ofertas' }"
        @click="seccionActiva = 'ofertas'"
      >
        Ofertas
      </button>
    </nav>

    <!-- SECCIÓN USUARIOS -->
    <section v-if="seccionActiva === 'usuarios'" class="panel">
      <h3>Usuarios registrados</h3>
      <table class="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuarios" :key="user.id_usuario">
            <td>{{ user.nombre }}</td>
            <td>{{ user.mail }}</td>
            <td>{{ user.tipo }}</td>
            <td>
              <button class="btn-sm danger" @click="eliminarUsuario(user.id_usuario)">
                Eliminar
              </button>
              <button
                v-if="user.tipo !== 'admin'"
                class="btn-sm success"
                @click="promoverUsuario(user.id_usuario)"
              >
                Promover a admin
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- SECCIÓN GRUPOS -->
    <section v-if="seccionActiva === 'grupos'" class="panel">
      <h3>Grupos registrados</h3>
      <ul class="lista">
        <li v-for="grupo in grupos" :key="grupo.id" class="item">
          <span>{{ grupo.nombre }}</span>
          <button class="btn-sm danger" @click="eliminarGrupo(grupo.id)">Eliminar</button>
        </li>
        <li v-if="grupos.length === 0">No hay grupos registrados.</li>
      </ul>
    </section>

    <!-- SECCIÓN OFERTAS -->
    <section v-if="seccionActiva === 'ofertas'" class="panel">
      <h3>Ofertas publicadas</h3>
      <ul class="lista">
        <li v-for="oferta in ofertas" :key="oferta.id" class="item">
          <div>
            <strong>{{ oferta.plataforma }}</strong> — {{ oferta.precio }} €
            <br />
            <small>Creada por {{ oferta.usuario }} ({{ oferta.grupo }})</small>
          </div>
          <button class="btn-sm danger" @click="eliminarOferta(oferta.id)">Eliminar</button>
        </li>
        <li v-if="ofertas.length === 0">No hay ofertas activas.</li>
      </ul>
    </section>

    <!-- BOTONES FINALES -->
    <footer class="acciones-finales">
      <button class="btn-pill-dark" @click="volverDashboard">
        ← Volver
      </button>
      <button class="btn-pill-red" @click="logout">
        Cerrar sesión
      </button>
    </footer>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";

const router = useRouter();
const auth = useAuthStore();
const admin = useAdminStore();

const seccionActiva = ref("usuarios");

// Computeds para NO tocar tu template
const usuarios = computed(() => admin.users);
const grupos = computed(() => admin.grupos);
const ofertas = computed(() => admin.ofertas);

onMounted(async () => {
  try {
    if (!auth.user) await auth.fetchMe();
    if (!auth.isAdmin) return router.push({ name: "dashboard" });

    await admin.loadAll();
  } catch (err) {
    console.error("Error al cargar datos de administración:", err);
  }
});

// === Acciones (mismas que ya tenías, pero delegando en el store) ===
async function eliminarUsuario(id_usuario: number) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
  await admin.eliminarUsuario(id_usuario);
}

async function promoverUsuario(id_usuario: number) {
  await admin.promoverUsuario(id_usuario);
}

async function eliminarGrupo(id: number) {
  if (!confirm("¿Eliminar este grupo?")) return;
  await admin.eliminarGrupo(id);
}

async function eliminarOferta(id: number) {
  if (!confirm("¿Eliminar esta oferta?")) return;
  await admin.eliminarOferta(id);
}

async function actualizarSaldo(user: any) {
  if (user.nuevoSaldo == null) return alert("Introduce un saldo válido.");
  await admin.actualizarSaldo(user);
  user.nuevoSaldo = null;
  alert(`Saldo de ${user.nombre} actualizado.`);
}

function volverDashboard() {
  router.push({ name: "dashboard" });
}

async function logout() {
  await auth.logout();
  router.push({ name: "login" });
}
</script>

<style scoped>
/* === CONTENEDOR GENERAL === */
.admin {
  min-height: 100vh;
  padding: 2.5rem 3rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  font-family: "Inter", sans-serif;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header,
.acciones-globales,
.panel,
.acciones-finales {
  width: 100%;
  max-width: 1150px;
}

/* === HEADER === */
.header {
  text-align: center;
  margin-bottom: 1.8rem;
}

.title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #f9fafb;
}

.subtitle {
  margin-top: 0.25rem;
  color: #e5edff;
  font-size: 0.95rem;
}

/* == BOTONES NAV SUPERIORES (ESTILO DASHBOARD) == */
.acciones-globales {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.btn-glossy {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 0.7rem 1.9rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  box-shadow: 0 8px 22px rgba(15, 118, 255, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.btn-glossy:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(15, 118, 255, 0.6);
  filter: brightness(1.05);
}

/* Botón nav activo */
.btn-glossy.active {
  background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
  box-shadow: 0 14px 32px rgba(37, 99, 235, 0.7);
  transform: translateY(-3px) scale(1.03);
}

/* === PANEL PRINCIPAL === */
.panel {
  background: rgba(15, 23, 42, 0.92);
  border-radius: 1.5rem;
  padding: 1.75rem 2rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  margin-bottom: 1.75rem;
}

.panel h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f9fafb;
}

/* === TABLA USUARIOS === */
.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

th,
td {
  padding: 0.75rem 0.9rem;
  text-align: left;
}

th {
  color: #cbd5f5;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

tbody tr {
  border-bottom: 1px solid rgba(31, 41, 55, 0.8);
}

tbody tr:nth-child(odd) {
  background: rgba(30, 41, 59, 0.6);
}

tbody tr:nth-child(even) {
  background: rgba(15, 23, 42, 0.6);
}

tbody tr:hover {
  background: rgba(37, 99, 235, 0.25);
}

/* === BOTONES ACCIÓN PEQUEÑOS === */
.btn-sm {
  padding: 0.35rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease;
}

.btn-sm.danger {
  background: #dc2626;
  color: #fff;
}

.btn-sm.danger:hover {
  background: #b91c1c;
  transform: translateY(-2px);
}

.btn-sm.success {
  background: #16a34a;
  color: #fff;
}

.btn-sm.success:hover {
  background: #15803d;
  transform: translateY(-2px);
}

/* === LISTAS (GRUPOS / OFERTAS) === */
.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  background: rgba(30, 41, 59, 0.7);
  border-radius: 1rem;
  padding: 0.9rem 1.1rem;
  margin-bottom: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.item span,
.item div {
  color: #e5e7eb;
  font-size: 0.9rem;
}

/* === BOTONES FINALES (VOLVER / LOGOUT) === */
.acciones-finales {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-pill-dark {
  background: #111827;
  color: #ffffff;
  border-radius: 999px;
  padding: 0.7rem 1.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.7);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.btn-pill-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.9);
  filter: brightness(1.05);
}

.btn-pill-red {
  background: #ef4444;
  color: #ffffff;
  border-radius: 999px;
  padding: 0.7rem 1.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(185, 28, 28, 0.7);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.btn-pill-red:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(185, 28, 28, 0.9);
  filter: brightness(1.05);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .admin {
    padding: 1.75rem 1.25rem;
  }

  .panel {
    padding: 1.3rem 1.3rem;
  }

  .acciones-finales {
    flex-direction: column;
  }

  .btn-pill-dark,
  .btn-pill-red {
    width: 100%;
    justify-content: center;
  }
}
</style>