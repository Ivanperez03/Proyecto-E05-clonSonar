<template>
  <div class="pago-container">

    <!-- BOTÓN VOLVER -->
    <button class="back-btn" @click="volverCuenta">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor" class="icon">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      Volver
    </button>

    <!-- TARJETA PRINCIPAL -->
    <div class="card animate-fade-in">

      <h2 class="title">Ingresar saldo</h2>
      <p class="subtitle">Introduce la cantidad que quieres añadir a tu saldo</p>

      <div class="input-group">
        <label>Cantidad (€)</label>
        <input 
          v-model.number="cantidad"
          type="number"
          min="1"
          placeholder="0.0"
        />
      </div>

      <button class="btn-pay" @click="añadirSaldo">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="icon">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6v12m6-6H6" />
        </svg>
        Añadir
      </button>

      <p class="mensaje" v-if="mensaje">{{ mensaje }}</p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiax from "@/apiAxios";

const router = useRouter();
const auth = useAuthStore();

const cantidad = ref<number | null>(null);
const mensaje = ref("");

async function añadirSaldo() {
  if (!cantidad.value || cantidad.value <= 0) {
    mensaje.value = "Introduce una cantidad válida.";
    return;
  }

  try {
    await apiax.post(`/usuarios/${auth.user}/saldo/añadir`, {
      cantidad: cantidad.value,
    });

    mensaje.value = "Saldo añadido correctamente ✔";
    cantidad.value = null;
  } catch (e) {
    mensaje.value = "Error al añadir saldo.";
  }
}

function volverCuenta() {
  router.push({ name: "cuenta" });
}
</script>

<style scoped>
/* CONTENEDOR GENERAL */
.pago-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  align-items: center;
  animation: fadePage 0.4s ease-in-out;
}

/* BOTÓN VOLVER */
.back-btn {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
  backdrop-filter: blur(6px);
  transition: 0.25s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateX(-3px);
}

.icon {
  width: 20px;
  height: 20px;
}

/* TARJETA */
.card {
  background: rgba(255, 255, 255, 0.2);
  padding: 2rem;
  border-radius: 1.2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-width: 380px;
  width: 100%;
  text-align: center;
  margin-top: 3rem;
}

/* TEXTOS */
.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.subtitle {
  font-size: 0.95rem;
  color: #f2f2f2;
  margin-bottom: 1.5rem;
}

/* INPUT */
.input-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

label {
  color: white;
  font-weight: 600;
}

input {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.8rem;
  border-radius: 0.6rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

/* BOTÓN PAGAR */
.btn-pay {
  width: 100%;
  background: #4ade80;
  color: #064e3b;
  border: none;
  padding: 0.9rem;
  border-radius: 0.9rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: 0.25s;
  font-size: 1rem;
}

.btn-pay:hover {
  background: #22c55e;
  transform: scale(1.03);
}

.mensaje {
  margin-top: 1rem;
  font-weight: 600;
  color: white;
}

/* ANIMACIONES */
@keyframes fadePage {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadePage 0.5s ease;
}
</style>

