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

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiax from "../apiAxios"; // 🔹 usamos el cliente Axios con cookies

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

const registerUser = async () => {
  // Validaciones básicas
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = "Las contraseñas no coinciden.";
    return;
  }

  const regexTelefono = /^[0-9]{9}$/;
  if (!regexTelefono.test(form.value.telefono)) {
    errorMessage.value = "El teléfono debe contener solo números de 9 dígitos.";
    return;
  }

  errorMessage.value = "";

  try {
    await apiax.post("/users", {
      nombre: form.value.nombre,
      email: form.value.email,
      telefono: form.value.telefono,
      password: form.value.password,
    });

    router.push("/login");
  } catch (e: any) {
    console.error("AXIOS ERROR:", e?.message, e?.code, e?.response?.status, e?.response?.data);
    errorMessage.value =
      e?.response?.data?.message ??
      e?.message ??
      "Error registrando usuario";
  }
};

const goToSignIn = () => router.push("/login");
</script>

<style scoped>
/* ===== CONTENEDOR GENERAL ===== */
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  font-family: "Inter", sans-serif;
}

/* ===== TARJETA ===== */
.register-card {
  width: 100%;
  max-width: 460px;
  padding: 2.8rem 2.6rem;
  border-radius: 18px;

  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(18px);

  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.25);

  animation: fadeUp 0.6s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== TÍTULOS ===== */
h1 {
  text-align: center;
  font-size: 1.9rem;
  font-weight: 800;
  margin-bottom: 0.4rem;

  background: linear-gradient(120deg, #1e293b, #312e81);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  text-align: center;
  color: rgba(30, 41, 59, 0.75);
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

/* ===== FORMULARIO ===== */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1.2rem;
}

label {
  font-weight: 600;
  font-size: 0.88rem;
  color: #0f172a;
}

/* ===== INPUTS ===== */
input {
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
  transition: 0.25s ease;
}

input:hover {
  background: rgba(255, 255, 255, 0.85);
}

input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35);
}

/* ===== BOTÓN ===== */
.btn-primary {
  width: 100%;
  padding: 0.85rem;
  margin-top: 0.6rem;

  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;

  background: linear-gradient(135deg, #4f46e5, #22d3ee);
  color: white;
  border: none;

  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 10px 30px rgba(45, 70, 185, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 35px rgba(45, 70, 185, 0.45);
  filter: brightness(1.05);
}

/* ===== ERROR ===== */
.error {
  color: #e11d48;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

/* ===== LINK LOGIN ===== */
.login-link {
  text-align: center;
  margin-top: 1.6rem;
  font-size: 0.95rem;
  color: #334155;
}

.login-link a {
  color: #4f46e5;
  font-weight: 700;
  cursor: pointer;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
