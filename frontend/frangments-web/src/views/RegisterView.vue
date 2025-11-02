<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Crear cuenta</h1>
      <p class="subtitle">Únete a Fragments y empieza a compartir</p>

      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="form.nombre" required />
        </div>

        <div class="form-group">
          <label for="apellidos">Apellidos</label>
          <input type="text" id="apellidos" v-model="form.apellidos" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input type="tel" id="telefono" v-model="form.telefono" required />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Repita la contraseña</label>
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" required />
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button type="submit" class="btn-primary">Registrarse</button>
      </form>

      <p class="login-link">
        ¿Ya tienes una cuenta?
        <a @click.prevent="goToSignIn" href="#">Inicia sesión</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  password: "",
  confirmPassword: "",
});

const errorMessage = ref("");

const registerUser = () => {
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = "Las contraseñas no coinciden.";
    return;
  }

  errorMessage.value = "";

  // Aquí iría la lógica de registro real (API, Firebase, etc.)
  console.log("Datos del registro:", form.value);

  // Redirigir al home o login
  router.push("/dashboard");
};

const goToSignIn = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff, #8ca6f7);
  font-family: "Inter", sans-serif;
  padding: 1rem;
}

.register-card {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

h1 {
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

input {
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #4b6cb7;
}

.btn-primary {
  width: 100%;
  background-color: #4b6cb7;
  color: white;
  border: none;
  padding: 0.9rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 0.5rem;
}

.btn-primary:hover {
  background-color: #3551a1;
}

.error {
  color: #d93025;
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #555;
}

.login-link a {
  color: #4b6cb7;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
