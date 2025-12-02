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

// Función para añadir saldo
async function añadirSaldo() {
  if (!cantidad.value || cantidad.value <= 0) {
    mensaje.value = "Introduce una cantidad válida.";
    return;
  }

  // Obtener ID del usuario desde Pinia
  const id_usuario = auth.user?.id;
  if (!id_usuario) {
    mensaje.value = "Usuario no válido.";
    return;
  }

  try {
    const token = localStorage.getItem("token"); // JWT

    const response = await apiax.post(
      `/cartera/${id_usuario}/recargar`,
      { cantidad: cantidad.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    mensaje.value = response.data.message || "Saldo añadido correctamente ✔";

    // Actualizar saldo en store para reflejarlo en la UI
    if (auth.user.saldo !== undefined) {
      auth.user.saldo += cantidad.value;
    }

    cantidad.value = null;

  } catch (error: any) {
    console.error("Error añadiendo saldo:", error);
    mensaje.value = error.response?.data?.message || "❌ Error al añadir saldo";
  }
}

// Función para volver a la cuenta
function volverCuenta() {
  router.push({ name: "cuenta" });
}
</script>



<style scoped>
/* ===== CONTENEDOR GENERAL ===== */
.pago-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1.5rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  animation: fadePage 0.4s ease-in-out;
  position: relative;
}

/* ===== BOTÓN VOLVER (arriba-izquierda) ===== */
.back-btn {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;

  background: rgba(15, 23, 42, 0.6);
  color: #e5e7eb;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  border: 1px solid rgba(148, 163, 184, 0.7);
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.22s ease;
}

.back-btn:hover {
  transform: translateX(-2px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.6);
}

.icon {
  width: 18px;
  height: 18px;
}

/* ===== TARJETA PRINCIPAL ===== */
.card {
  max-width: 420px;
  width: 100%;
  padding: 2.3rem 2.4rem 2rem;
  border-radius: 1.6rem;

  background: radial-gradient(circle at top left,
    rgba(15, 23, 42, 0.9),
    rgba(15, 23, 42, 0.98)
  );
  border: 1px solid rgba(148, 163, 184, 0.7);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(18px);

  text-align: center;
}

/* ===== TEXTOS ===== */
.title {
  font-size: 1.9rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
  color: #f9fafb;
}

.subtitle {
  font-size: 0.95rem;
  color: rgba(203, 213, 225, 0.9);
  margin-bottom: 1.8rem;
}

/* ===== INPUT ===== */
.input-group {
  text-align: left;
  margin-bottom: 1.6rem;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.9);
}

input {
  width: 100%;
  margin-top: 0.45rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  outline: none;
  font-size: 1rem;

  background: rgba(15, 23, 42, 0.96);
  color: #e5e7eb;
  transition: 0.25s ease;
  box-sizing: border-box;
}

input::placeholder {
  color: rgba(148, 163, 184, 0.8);
}

input:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
}

/* ===== BOTÓN AÑADIR SALDO ===== */
.btn-pay {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.9rem;
  border-radius: 0.95rem;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;

  font-weight: 700;
  font-size: 1rem;

  background: linear-gradient(135deg, #22c55e, #4ade80);
  color: #022c22;
  box-shadow: 0 14px 30px rgba(22, 163, 74, 0.6);
  transition: 0.25s ease;
}

.btn-pay:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(22, 163, 74, 0.75);
  filter: brightness(1.03);
}

/* Mensaje de feedback */
.mensaje {
  margin-top: 1rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #bbf7d0;
}

/* ===== ANIMACIONES ===== */
@keyframes fadePage {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadePage 0.5s ease;
}

/* Responsive: botón volver más pegado al borde en pantallas pequeñas */
@media (max-width: 768px) {
  .pago-container {
    padding: 1.5rem 1.1rem;
  }

  .back-btn {
    top: 1.1rem;
    left: 1.1rem;
  }
}
</style>
