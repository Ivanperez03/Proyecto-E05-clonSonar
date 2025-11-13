<template>
  <div class="admin">
    <header class="header">
      <h2>Panel de Administración</h2>
      <p class="subtitle">Gestión de usuarios, grupos y ofertas</p>
    </header>

    <nav class="acciones-globales">
      <button class="btn" @click="seccionActiva = 'usuarios'">👤 Usuarios</button>
      <button class="btn" @click="seccionActiva = 'grupos'">👥 Grupos</button>
      <button class="btn" @click="seccionActiva = 'ofertas'">💸 Ofertas</button>
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
              <button class="btn-sm danger" @click="eliminarUsuario(user.id_usuario)">Eliminar</button>
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

    <footer class="acciones-finales">
      <button class="btn secondary" @click="volverDashboard">⬅ Volver</button>
      <button class="btn logout" @click="logout">Cerrar sesión</button>
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
.admin {
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff, #8ca6f7);
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  color: #1f2937;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.subtitle {
  color: #374151;
  font-size: 0.95rem;
}

.acciones-globales {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.panel {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.6rem;
  text-align: left;
  border-bottom: 1px solid #d1d5db;
}

.btn, .btn-sm {
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn {
  padding: 0.7rem 1.2rem;
  background: #4b6cb7;
  color: #fff;
}

.btn:hover {
  background: #3c5aa6;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-sm.danger {
  background: #ef4444;
  color: #fff;
}

.btn-sm.danger:hover {
  background: #dc2626;
}

.btn-sm.success {
  background: #16a34a;
  color: #fff;
}

.btn-sm.success:hover {
  background: #15803d;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.8rem 1rem;
  margin-bottom: 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.acciones-finales {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn.secondary {
  background: #9ca3af;
}

.btn.secondary:hover {
  background: #6b7280;
}

.btn.logout {
  background: #ef4444;
}

.btn.logout:hover {
  background: #dc2626;
}
</style>
