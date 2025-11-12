<template>
  <div class="buscador">
    <header class="header">
      <h2>Buscador de Plataformas</h2>
      <p class="subtitle">Encuentra fácilmente las plataformas que te interesan</p>
    </header>

    <div class="search-bar">
        <nav class="nav">
        <button type="button" class="btn back" @click="volverDashboard">⬅ Volver</button>
      </nav>
      <input
        type="text"
        v-model="query"
        placeholder="Buscar plataforma..."
        @input="filtrarPlataformas"
      />
      <button class="btn buscar">Buscar</button>
    </div>

    <div class="filters">
      <button
        v-for="(filtro, index) in filtros"
        :key="index"
        :class="['filter-btn', { active: filtroSeleccionado === filtro }]"
        @click="seleccionarFiltro(filtro)"
      >
        {{ filtro }}
      </button>
    </div>

    <section class="resultados">
      <div v-if="resultadosFiltrados.length > 0" class="plataformas">
        <div class="plataforma-card" v-for="plataforma in resultadosFiltrados" :key="plataforma.id">
          <h3>{{ plataforma.nombre }}</h3>
          <p>{{ plataforma.descripcion }}</p>
          <button class="btn detalle">Ver detalles</button>
        </div>
      </div>

      <p v-else class="no-resultados">No se encontraron resultados.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// Datos simulados — reemplaza luego con una llamada a la API si lo necesitas
const plataformas = ref([
  { id: 1, nombre: "Netflix", categoria: "Streaming", descripcion: "Películas y series ilimitadas" },
  { id: 2, nombre: "Spotify", categoria: "Música", descripcion: "Escucha millones de canciones" },
  { id: 3, nombre: "Disney+", categoria: "Streaming", descripcion: "Series, películas y más de Disney" },
  { id: 4, nombre: "Xbox Game Pass", categoria: "Videojuegos", descripcion: "Juegos ilimitados por suscripción" },
  { id: 5, nombre: "Canva Pro", categoria: "Diseño", descripcion: "Herramientas profesionales de diseño" },
]);

const query = ref("");
const router = useRouter();
const filtroSeleccionado = ref<string | null>(null);
const filtros = ["Streaming", "Música", "Videojuegos", "Diseño", "Educación"];

const resultadosFiltrados = computed(() => {
  return plataformas.value.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(query.value.toLowerCase());
    const coincideFiltro = !filtroSeleccionado.value || p.categoria === filtroSeleccionado.value;
    return coincideTexto && coincideFiltro;
  });
});

function seleccionarFiltro(filtro: string) {
  filtroSeleccionado.value = filtroSeleccionado.value === filtro ? null : filtro;
}

function filtrarPlataformas() {
  // En un caso real podrías llamar a tu API aquí con el texto de búsqueda
}

function volverDashboard() {
  router.push({ name: "dashboard" });
}
</script>

<style scoped>
.buscador {
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

.nav {
  display: flex;
  gap: 10rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 500px;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  outline: none;
}

.search-bar input:focus {
  border-color: #4b6cb7;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.7rem 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn.buscar {
  background: #4b6cb7;
  color: #fff;
}

.btn.buscar:hover {
  background: #3c5aa6;
}

.filters {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.filter-btn {
  background: #e5e7eb;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  color: #1f2937;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #c7d2fe;
}

.filter-btn.active {
  background: #4b6cb7;
  color: #fff;
}

.resultados {
  width: 100%;
  max-width: 900px;
}

.plataformas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.plataforma-card {
  background: rgba(255, 255, 255, 0.6);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.plataforma-card h3 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.plataforma-card p {
  color: #374151;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn.detalle {
  background: #4b6cb7;
  color: white;
}

.btn.detalle:hover {
  background: #3c5aa6;
}

.no-resultados {
  text-align: center;
  color: #6b7280;
  margin-top: 2rem;
}
</style>
