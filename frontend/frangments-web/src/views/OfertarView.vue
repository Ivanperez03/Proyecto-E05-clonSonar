<template>
  <div class="ofertar">
    <header class="header">
      <h2>Publicar una nueva oferta</h2>
      <p class="subtitle">Crea una oferta y compártela con la comunidad</p>
    </header>

    <form class="form" @submit.prevent="crearOferta">
      <div class="form-group">
        <label for="plataforma">Plataforma del plan</label>
        <select id="plataforma" v-model="form.plataforma" required>
          <option disabled value="">Selecciona una plataforma</option>
          <option v-for="p in plataformas" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="precio">Precio (€)</label>
        <input
          type="number"
          id="precio"
          v-model.number="form.precio"
          placeholder="Introduce el precio"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div class="form-group">
        <label for="fecha">Fecha de vencimiento</label>
        <input
          type="date"
          id="fecha_vencimiento"
          v-model="form.fecha_vencimiento"
          placeholder="Tu nombre"
          required
        />
      </div>

      <div class="form-group">
        <label for="grupo">Nombre del grupo</label>
        <input
          type="text"
          id="grupo"
          v-model="form.grupo"
          placeholder="Ejemplo: CompartirNetflix"
          required
        />
      </div>

      <div class="botones">
        <button class="btn publicar" type="submit">Publicar oferta</button>
        <button type="button" class="btn back" @click="volverDashboard">⬅ Volver</button>
      </div>
    </form>

    <div v-if="mensaje" class="mensaje">
      {{ mensaje }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import apiax from "@/apiAxios"; // Cliente Axios de tu proyecto
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();

const plataformas = [
  "Netflix",
  "Spotify",
  "Disney+",
  "HBO Max",
  "Amazon Prime Video",
  "Crunchyroll",
  "Apple TV+",
];

const form = ref({
  plataforma: "",
  precio: null as number | null,
  fecha_vencimiento: Date || "",
  grupo: "",
});

const mensaje = ref("");

async function crearOferta() {
  try {
    if (!form.value.plataforma || !form.value.precio || !form.value.fecha_vencimiento || !form.value.grupo) {
      mensaje.value = "Por favor, completa todos los campos.";
      return;
    }

    // Simulación de envío a la API
    console.log("Oferta enviada:", form.value);
    mensaje.value = "✅ Oferta publicada con éxito.";

    // Limpiar formulario
    form.value = { plataforma: "", precio: null, fecha_vencimiento: Date, grupo: "" };
  } catch (error) {
    console.error(error);
    mensaje.value = "❌ Error al publicar la oferta.";
  }
}

function volverDashboard() {
  router.push({ name: "dashboard" });
}
</script>

<style scoped>
.ofertar {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  font-family: "Inter", sans-serif;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* HEADER */
.header {
  text-align: center;
}

.header h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
}

.subtitle {
  color: #4b5563;
  font-size: 0.95rem;
  margin-top: 0.4rem;
}

/* CARD FORM */
.form {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  padding: 2.2rem 2.5rem;
  border-radius: 1.3rem;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

/* GRUPOS */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1f2937;
}

/* INPUTS / SELECT */
input,
select {
  padding: 0.8rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  background: #f9fafb;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

input:focus,
select:focus {
  border-color: #4b6cb7;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25);
}

/* BOTONES */
.botones {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn {
  flex: 1;
  font-weight: 600;
  border: none;
  border-radius: 0.9rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

/* Publicar */
.btn.publicar {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}

.btn.publicar:hover {
  transform: translateY(-2px);
  opacity: 0.98;
}

/* Volver */
.btn.back {
  background: #e5e7eb;
  color: #111827;
}

.btn.back:hover {
  transform: translateY(-2px);
  background: #d1d5db;
}

/* MENSAJE */
.mensaje {
  margin-top: 1.25rem;
  font-weight: 600;
  color: #111827;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.9rem 1.1rem;
  border-radius: 0.9rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
}
</style>
