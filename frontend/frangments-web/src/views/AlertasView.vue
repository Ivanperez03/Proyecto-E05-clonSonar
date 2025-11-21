<template>
  <div class="alertas">

    <!-- TOP BAR -->
    <header class="topbar animate-fade">
      <h2 class="title">Mis alertas</h2>

      <button class="btn small primary" @click="volverDashboard">
        ⬅ Volver
      </button>
    </header>

    <!-- LISTA DE ALERTAS -->
    <section class="alertas-list animate-fade-delayed">
      <div
        v-for="(alerta, i) in alertas"
        :key="i"
        class="alert-card float"
      >
        <div class="alert-header">
          <span class="alert-type" :class="alerta.tipo">{{ formatearTipo(alerta.tipo) }}</span>
          <span class="alert-date">{{ alerta.fecha }}</span>
        </div>

        <p class="alert-text">{{ alerta.mensaje }}</p>
      </div>

      <!-- Si no hay alertas -->
      <p v-if="alertas.length === 0" class="no-alerts">
        No tienes alertas por ahora
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const volverDashboard = () => router.push("/dashboard");

// Ejemplo de alertas (puedes reemplazarlas por tu API)
const alertas = ref([
  { tipo: "pago", mensaje: "Tienes un pago pendiente de Netflix.", fecha: "2025-01-02" },
  { tipo: "grupo", mensaje: "Has sido aceptado en el grupo Disney+.", fecha: "2025-01-03" },
  { tipo: "suscripcion", mensaje: "Tu suscripción a Max se renueva mañana.", fecha: "2025-01-04" },
  // Si añades más alertas, también se muestran
  // Si eliminas las alertas se muestra un mensaje de que no tienes alertas
]);

const formatearTipo = (tipo) => {
  const mapping = {
    pago: "Pago",
    grupo: "Grupo",
    suscripcion: "Suscripción",
  };
  return mapping[tipo] || "Alerta";
};
</script>

<style scoped>
.alertas {
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

.alertas > * {
  position: relative;
  z-index: 2;
}

/* TOPBAR */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color:rgba(9, 162, 233, 0.75)
}

/* BOTÓN VOLVER */
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

/* AREA DE ALERTAS */
.alertas-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

/* TARJETAS */
.alert-card {
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7));
  border: 1px solid rgba(148, 163, 184, 0.35);
  padding: 1.2rem 1.4rem;
  border-radius: 1.4rem;
  backdrop-filter: blur(16px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.alert-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.6);
  border-color: rgba(129, 140, 248, 0.8);
}

/* CABECERA DE TARJETA */
.alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.alert-type {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid rgba(148, 163, 184, 0.4);
}

/* COLORES TIPO ALERTA */
.alert-type.pago {
  background: rgba(220, 38, 38, 0.25);
  border-color: rgba(248, 113, 113, 0.7);
}

.alert-type.grupo {
  background: rgba(14, 165, 233, 0.25);
  border-color: rgba(56, 189, 248, 0.7);
}

.alert-type.suscripcion {
  background: rgba(168, 85, 247, 0.25);
  border-color: rgba(192, 132, 252, 0.7);
}

.alert-date {
  font-size: 0.82rem;
  opacity: 0.8;
}

.alert-text {
  font-size: 0.95rem;
  opacity: 0.95;
}

/* NO ALERTAS */
.no-alerts {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  opacity: 0.85;
}

/* ANIMACIONES (idénticas al dashboard) */
.animate-fade {
  animation: fadeIn 0.4s ease;
}

.animate-fade-delayed {
  animation: fadeIn 0.6s ease;
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
</style>

