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

.form {
  background: rgba(255, 255, 255, 0.5);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.4rem;
}

input,
select {
  padding: 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus {
  border-color: #4b6cb7;
}

.botones {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn {
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn.publicar {
  background: #4b6cb7;
  color: white;
}

.btn.publicar:hover {
  background: #3c5aa6;
}

.btn.back {
  background: #9ca3af;
  color: white;
}

.btn.back:hover {
  background: #6b7280;
}

.mensaje {
  margin-top: 1.5rem;
  font-weight: 600;
  color: #111827;
}
</style>
