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
        <div
          class="plataforma-card"
          v-for="plataforma in resultadosFiltrados"
          :key="plataforma.id_plataforma"
        >
          <div class="plat-left">
            <div class="plat-avatar">
              {{ plataforma.nombre[0] }}
            </div>

            <div class="plat-info">
              <h3>{{ plataforma.nombre }}</h3>
              <p>{{ plataforma.descripcion }}</p>
            </div>
          </div>

          <button class="btn detalle" @click="verPlanes(plataforma)">
            Consultar
          </button>
        </div>
      </div>

      <p v-else class="no-resultados">No se encontraron resultados.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

type Plataforma = {
  id_plataforma: number;
  nombre: string;
  categoria: string;
  descripcion: string;
};

const router = useRouter();

// ⚠️ IDs alineados con tu tabla `plataforma`
const plataformas = ref<Plataforma[]>([
  { id_plataforma: 1, nombre: "Spotify",     categoria: "Música",      descripcion: "Escucha millones de canciones" },
  { id_plataforma: 2, nombre: "Disney+",     categoria: "Streaming",   descripcion: "Series, películas y más de Disney" },
  { id_plataforma: 3, nombre: "HBO Max",     categoria: "Streaming",   descripcion: "Películas y series ilimitadas" },
  { id_plataforma: 4, nombre: "Prime Video", categoria: "Streaming",   descripcion: "Películas y series ilimitadas" },
  { id_plataforma: 5, nombre: "Crunchyroll", categoria: "Streaming",   descripcion: "Anime y contenido japonés" },
  { id_plataforma: 6, nombre: "Xbox Game Pass", categoria: "Videojuegos", descripcion: "Juegos ilimitados por suscripción" },
  { id_plataforma: 7, nombre: "Canva Pro",   categoria: "Diseño",      descripcion: "Herramientas profesionales de diseño" },
]);

const query = ref("");
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
  filtroSeleccionado.value =
    filtroSeleccionado.value === filtro ? null : filtro;
}

function volverDashboard() {
  router.push({ name: "dashboard" });
}

function verPlanes(plataforma: Plataforma) {
  router.push({
    name: "planes-plataforma",
    params: {
      id_plataforma: plataforma.id_plataforma, 
      plataforma: plataforma.nombre,           
    },
  });
}
</script>


<style scoped>
.buscador {
  min-height: 100vh;
  padding: 2.5rem 1.5rem 3rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== HEADER ===== */
.header {
  text-align: center;
  margin-bottom: 1.8rem;
}

.header h2 {
  font-size: 1.9rem;
  font-weight: 800;
  color: #111827;
}

.subtitle {
  margin-top: 0.25rem;
  color: #4b5563;
  font-size: 0.95rem;
}

/* ===== SEARCH BAR ===== */
.search-bar {
  width: 100%;
  max-width: 720px;

  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;

  margin-bottom: 1.4rem;
}

/* nav solo contiene el botón volver */
.nav {
  display: flex;
}

/* Botones base */
.btn {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 0.65rem 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

/* Volver */
.btn.back {
  background: rgba(15, 23, 42, 0.85);
  color: #e5e7eb;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.45);
}

.btn.back:hover {
  transform: translateX(-2px);
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.6);
}

/* Input búsqueda */
.search-bar input {
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  background: #f9fafb;
  color: #0f172a;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-bar input::placeholder {
  color: #9ca3af;
}

.search-bar input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.35);
}

/* Botón buscar */
.btn.buscar {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.45);
}

.btn.buscar:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(79, 70, 229, 0.6);
}

/* ===== FILTROS ===== */
.filters {
  width: 100%;
  max-width: 720px;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  color: #111827;
  border: 1px solid rgba(148, 163, 184, 0.7);
  transition: 0.2s ease;
}

.filter-btn:hover {
  background: #e0e7ff;
}

.filter-btn.active {
  background: #4f46e5;
  color: #ffffff;
  border-color: transparent;
}

/* ===== RESULTADOS / CONTENEDOR OSCURO ===== */
.resultados {
  width: 100%;
  max-width: 1040px;

  background: rgba(15, 23, 42, 0.97);
  border-radius: 1.7rem;
  padding: 2rem 2.2rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.9);

  color: #e5e7eb;
}

/* Grid de plataformas */
.plataformas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.2rem;
}

/* Tarjeta de cada plataforma */
/* Grid de plataformas */
.plataformas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.3rem;
}

/* Tarjeta estilo "Plataformas disponibles" */
.plataforma-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 0.9rem 1.4rem;
  border-radius: 999px;

  background: radial-gradient(circle at left, #2563eb, #020617 72%);
  border: 1px solid rgba(148, 163, 184, 0.5);

  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.7);
  color: #e5e7eb;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.plataforma-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 38px rgba(15, 23, 42, 0.9);
}

/* Parte izquierda: avatar + texto */
.plat-left {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

/* Avatar redondo con inicial */
.plat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: radial-gradient(circle at top, #fedf57, #f97316);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  color: #111827;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.6);
}

/* Texto plataforma */
.plat-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.plat-info p {
  margin: 0.1rem 0 0;
  font-size: 0.85rem;
  color: #d1d5db;
}

/* Botón "Ver detalles" estilo pill */
.btn.detalle {
  background: transparent;
  color: #e5e7eb;
  border: 1px solid rgba(248, 250, 252, 0.7);
  padding: 0.45rem 1.2rem;
  font-size: 0.85rem;
  border-radius: 999px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.7);
}

.btn.detalle:hover {
  background: #f9fafb;
  color: #111827;
}


/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .buscador {
    padding: 1.8rem 1rem 2.5rem;
  }

  .search-bar {
    grid-template-columns: 1fr;
    row-gap: 0.7rem;
  }

  .nav {
    justify-content: flex-start;
  }

  .btn.back {
    width: fit-content;
  }

  .resultados {
    padding: 1.5rem 1.3rem;
  }
}
</style>
