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

const email = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = () => {
  // aquí luego llamas a tu backend: POST http://localhost:3000/api/auth/login
  console.log("login", email.value, password.value);
  router.push("/dashboard");
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 4rem auto;
  background: #324663;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
.subtitle {
  margin-bottom: 1.5rem;
  color: #94a3b8;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
}
button {
  background: #10b981;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff, #8ca6f7);
  font-family: "Inter", sans-serif;
  padding: 1rem;
}
</style>
