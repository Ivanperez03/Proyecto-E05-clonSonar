<template>
  <div class="pago">
    <header class="header">
      <h2>Añadir saldo</h2>
      <p class="subtitle">Ingresa dinero a tu cuenta de Fragments</p>
    </header>

    <form class="form" @submit.prevent="añadirSaldo">
      <div class="form-group">
        <label for="cantidad">Cantidad a ingresar (€)</label>
        <input
          type="number"
          id="cantidad"
          v-model.number="cantidad"
          placeholder="0.0 "
          min="1"
          step="0.01"
          required
        />
      </div>

      <button type="submit" class="btn ingresar">Ingresar saldo</button>
    </form>

    <div v-if="mensaje" class="mensaje">
      {{ mensaje }}
    </div>

    <div class="acciones">
      <button class="btn volver" @click="volverDashboard">⬅ Volver</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import apiax from "@/apiAxios";

const auth = useAuthStore();
const router = useRouter();

const cantidad = ref<number | null>(null);
const mensaje = ref("");

async function añadirSaldo() {
  if (!cantidad.value || cantidad.value <= 0) {
    mensaje.value = "Introduce una cantidad válida.";
    return;
  }

  try {
    // Llamada real a tu API
    const { data } = await apiax.post(`/usuarios/${auth.user}/añadir-saldo`, {
      cantidad: cantidad.value,
    });

    mensaje.value = `✅ Saldo actualizado. Nuevo saldo: ${data.saldo} €`;

    cantidad.value = null; // Limpiar formulario
  } catch (error) {
    console.error(error);
    mensaje.value = "❌ Error al añadir saldo.";
  }
}

function volverDashboard() {
  router.push({ name: "dashboard" });
}
</script>

<style scoped>
.pago {
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
  max-width: 450px;
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

input {
  padding: 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
}

input:focus {
  border-color: #4b6cb7;
}

.btn {
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn.ingresar {
  background: #25a866;
  color: white;
}

.btn.ingresar:hover {
  background: #1c964f;
}

.mensaje {
  margin-top: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.acciones {
  margin-top: 2rem;
}

.btn.volver {
  background: #9ca3af;
  color: white;
}

.btn.volver:hover {
  background: #6b7280;
}
</style>

