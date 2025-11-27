<template>
  <div class="planes-plataforma">
    <!-- HEADER -->
    <header class="top">
      <button type="button" class="btn back" @click="volverBuscador">
        ← Volver
      </button>

      <div class="header-main">
        <h2>Planes para {{ nombrePlataforma }}</h2>
        <p class="subtitle">
          Elige un grupo activo y únete a una suscripción compartida.
        </p>
      </div>
    </header>

    <!-- ESTADO: CARGANDO -->
    <section v-if="loading" class="sin-planes">
      <p>Cargando planes...</p>
    </section>

    <!-- ESTADO: ERROR -->
    <section v-else-if="error" class="sin-planes">
      <p>{{ error }}</p>
    </section>

    <!-- LISTA DE PLANES -->
    <section v-else-if="planesUI.length" class="lista-planes">
      <article
        v-for="plan in planesUI"
        :key="plan.id"
        class="card-plan"
      >
        <div class="plan-main">
          <h3 class="plan-title">{{ plan.nombreGrupo }}</h3>

          <div class="plan-meta">
            <div class="meta-item">
              <span class="meta-label">Precio total mensual </span>
              <span class="meta-value">
                {{ plan.precioTotalMensual }} € /mes
              </span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Miembros actuales </span>
              <span class="meta-value">
                {{ plan.miembrosActuales }} / {{ plan.capacidadTotal }}
              </span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Tu pagarías mensualmente: </span>
              <span class="meta-value precio">
                {{ plan.precioPorUsuario }} €/mes
              </span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Vence el </span>
              <span class="meta-value">
                {{ plan.fechaVencimiento }}
              </span>
            </div>
          </div>
        </div>

        <div class="plan-actions">
          <button class="btn-glossy" @click="unirse(plan)">
            Unirme al grupo
          </button>
        </div>
      </article>
    </section>

    <!-- SIN PLANES -->
    <section v-else class="sin-planes">
      <p>No hay planes activos para esta plataforma en este momento.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePlanesPlataformaStore } from "@/stores/planesPlataforma";

const route = useRoute();
const router = useRouter();

const store = usePlanesPlataformaStore();
const { planes, loading, error } = storeToRefs(store);

const idPlataforma = computed(() => Number(route.params.id_plataforma));
const nombrePlataforma = computed(() => route.params.plataforma as string);

const planesUI = computed(() =>
  planes.value.map((p: any) => ({
    id: p.id_plan,
    nombreGrupo: p.nombre_grupo,
    precioTotalMensual: Number(p.precio_total_mensual).toFixed(2),
    precioPorUsuario: Number(p.precio_por_usuario).toFixed(2),
    miembrosActuales: Number(p.miembros_actuales) ?? 0,
    capacidadTotal: Number(p.capacidad_total) ?? 0,
    fechaVencimiento: new Date(p.fecha_vencimiento).toLocaleDateString("es-ES"),
  }))
);


async function cargar() {
  if (!idPlataforma.value) return;
  await store.cargarPlanes(idPlataforma.value);
}

function volverBuscador() {
  router.push({ name: "buscador" });
}

async function unirse(plan: any) {
  try {
    const resp = await store.unirse(plan.id);
    alert(resp.message);
    router.push({ name: "dashboard" });
  } catch (e: any) {
    alert(e.message);
  }
}

onMounted(cargar);
watch(idPlataforma, cargar);
</script>



<style scoped>
.planes-plataforma {
  min-height: 100vh;
  padding: 2.5rem 3rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  font-family: "Inter", sans-serif;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* HEADER */
.top {
  width: 100%;
  max-width: 1150px;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.header-main {
  flex: 1;
}

.header-main h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #334155; 
  font-size: 1rem;
  margin-top: 0.3rem;
}

/* BADGES RESUMEN */
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

/* BOTÓN VOLVER (oscuro, como en cuenta/admin) */
.btn-back {
  background: #111827;
  color: #ffffff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.65);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn-back:hover {
  transform: translateY(-2px);
  background: #1f2937;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.85);
}

/* LISTA DE PLANES */
.lista-planes {
  width: 100%;
  max-width: 1150px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* TARJETA PLAN */
.card-plan {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.6rem 1.8rem;
  border-radius: 1.5rem;
  background: radial-gradient(circle at top left, #1f2937, #020617);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.7);
}

.plan-main {
  flex: 1;
}

.plan-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.badge-plataforma {
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #3b82f6, #22d3ee);
}

.plan-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.plan-desc {
  color: #cbd5f5;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* META INFO */
.plan-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.meta-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
}

.meta-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e5e7eb;
}

.meta-value.precio {
  font-size: 1.15rem;
  color: #4ade80;
}

/* ACCIONES DEL PLAN */
.plan-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.45rem;
}

/* Botón glossy (como dashboard) */
.btn-glossy {
  padding: 0.75rem 1.8rem;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  color: #ffffff;
  background: linear-gradient(135deg, #3d6cfa, #1fc9ff);
  box-shadow: 0px 7px 18px rgba(28, 120, 255, 0.55);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.btn-glossy:hover {
  transform: translateY(-3px);
  box-shadow: 0px 10px 24px rgba(28, 120, 255, 0.75);
}

/* Estado deshabilitado */
.btn-glossy:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}

.plazas-libres {
  font-size: 0.8rem;
  color: #a7f3d0;
}

.plazas-llenas {
  font-size: 0.8rem;
  color: #fecaca;
}

/* SIN PLANES */
.sin-planes {
  width: 100%;
  max-width: 1150px;
  margin-top: 2rem;
  text-align: center;
  color: #e5e7eb;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .top {
    flex-direction: column;
    align-items: stretch;
  }

  .card-plan {
    flex-direction: column;
  }

  .plan-actions {
    align-items: flex-start;
  }

  .plan-meta {
    grid-template-columns: 1fr;
  }

  .planes-plataforma {
    padding: 2rem 1.5rem;
  }
}
</style>