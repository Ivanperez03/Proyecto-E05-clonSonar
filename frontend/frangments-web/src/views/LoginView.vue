<template>
  <div class="login-container">
    <div class="login">
      <h1>Fragments</h1>
      <p class="subtitle">Login</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          Email
          <input v-model="email" type="email" required />
        </label>

        <label>
          Password
          <input v-model="password" type="password" required />
        </label>

        <button type="submit">Entrar</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
  try {
    // Inicia sesión con los datos ingresados
    await auth.login(email.value, password.value);
    router.push({ name: "dashboard" });


  } catch (e: any) { 
    // Muestra mensaje de error si el login falla
    errorMessage.value = e?.response?.data?.message ?? "Correo o contraseña incorrectos";
  }
};
</script>


<style scoped>
/* ===== CONTENEDOR GENERAL ===== */
.login-container {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
}

/* ===== TARJETA LOGIN (glass) ===== */
.login {
  width: 100%;
  max-width: 420px;
  padding: 2.4rem 2.3rem 2.2rem;
  border-radius: 18px;

  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.25);

  animation: fadeUp 0.6s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ===== TÍTULOS ===== */
h1 {
  font-size: 1.9rem;
  margin: 0 0 0.3rem;
  font-weight: 800;
  text-align: center;

  background: linear-gradient(120deg, #1e293b, #312e81);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  text-align: center;
  margin-bottom: 1.9rem;
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(51, 65, 85, 0.8);
}

/* ===== FORMULARIO ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-size: 0.86rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

/* ===== INPUTS ===== */
input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  color: #0f172a;
  transition: 0.25s ease;
  box-sizing: border-box;
}

input:hover {
  background: rgba(255, 255, 255, 0.9);
}

input:focus {
  outline: none;
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35);
}

/* ===== BOTÓN ENTRAR ===== */
button {
  margin-top: 0.4rem;
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;

  background: linear-gradient(135deg, #4f46e5, #22d3ee);
  color: #ffffff;
  box-shadow: 0 10px 30px rgba(45, 70, 185, 0.35);
  transition: 0.25s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 35px rgba(45, 70, 185, 0.45);
  filter: brightness(1.05);
}

/* ===== ERROR ===== */
.error-message {
  margin-top: 0.6rem;
  font-size: 0.9rem;
  text-align: center;
  color: #e11d48;
}
</style>
