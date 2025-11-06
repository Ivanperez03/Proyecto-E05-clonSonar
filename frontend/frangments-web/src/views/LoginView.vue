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
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
  await auth.login(email.value, password.value);
  router.push({ name: "dashboard" }); 
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8edff, #cdd9ff);
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: left;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.subtitle {
  margin-bottom: 1.5rem;
  color: #64748b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
  display: block;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #4b6cb7;
}

button {
  background: #4b6cb7;
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  width: 100%;
}

button:hover {
  background: #3b5aa3;
}
</style>
