<template>
  <div class="home">

    <!-- TOPBAR -->
    <header class="topbar">
      <div class="logo-area">
        <img src="@/assets/new_logo_Fragments.png" alt="Fragments Logo" class="logo" />
      </div>

      <div class="actions">
        <button class="btn secondary" @click="goToSignIn">Iniciar sesión</button>
        <button class="btn primary" @click="goToSignUp">Crear cuenta</button>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-text">
        <h1>
          Comparte plataformas <br />
          ahorra más, vive mejor
        </h1>
        <p>
          Únete a Fragments y descubre una nueva forma de compartir planes, gestionar grupos
          y acceder a tus plataformas favoritas al menor precio.
        </p>
        <button class="btn primary big" @click="goToSignUp">
          Empieza ahora
        </button>
      </div>

      <div class="hero-image">
        <img src="@/assets/new_pets.png" alt="Ilustración Fragments" />
      </div>
    </section>

    <!-- CARDS -->
    <section class="cards">
      <article class="card">
        <h2>Encuentra planes</h2>
        <p>Explora ofertas creadas por otros usuarios y únete a grupos activos.</p>
      </article>

      <article class="card">
        <h2>Crea tus ofertas</h2>
        <p>Publica tus propios planes y consigue nuevos compañeros de suscripción.</p>
      </article>

      <article class="card">
        <h2>Gestiona tus grupos</h2>
        <p>Administra grupos, pagos, suscripciones y tu saldo fácilmente.</p>
      </article>
    </section>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goToSignIn = () => router.push("/login");
const goToSignUp = () => router.push("/register");
</script>

<style scoped>
/* ===== GENERAL ===== */
.home {
  min-height: 100vh;
  padding: 2.5rem 2rem;
  background: radial-gradient(circle at top right, #4e54c8, #676da8 70%);
  font-family: "Inter", sans-serif;
  color: #1f2937;
}

/* ===== TOPBAR ===== */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.01rem;
}

.logo {
  width: 250px;          /* Más grande */
  filter: drop-shadow(0 0 6px #6d28d9aa); /* Glow suave */
  transition: transform 0.3s ease;
}
.logo:hover {
  transform: scale(1.05);
}

/* ===== BUTTONS ===== */
.btn {
  border: none;
  cursor: pointer;
  border-radius: 0.6rem;
  padding: 0.75rem 1.4rem;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn.primary {
  background: #4b2fb3;
  color: white;
}
.btn.primary:hover {
  background: #381f99;
}

.btn.secondary {
  background: transparent;
  color: #4b2fb3;
  border: 2px solid #4b2fb3;
}
.btn.secondary:hover {
  background: #4b2fb3;
  color: white;
}

.btn.big {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* ===== HERO SECTION ===== */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.hero-text {
  flex: 1;
  min-width: 300px;
}

.hero-text h1 {
  font-size: 3rem;
  font-weight: 800;
  color: #2b1a78; /* Morado profundo coherente */
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-text p {
  font-size: 1.15rem;
  color: #3a3a3a;
  margin-bottom: 2rem;
  max-width: 520px;
  line-height: 1.6;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  width: 100%;
  max-width: 420px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
}

/* ===== CARDS ===== */
.cards {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.card {
  background: rgba(255, 255, 255, 0.6);
  padding: 1.5rem;
  border-radius: 1rem;
  flex: 1;
  min-width: 220px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px #00000030;
  text-align: center;
  transition: all 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
}

.card h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2b1a78;
  margin-bottom: 0.5rem;
}

.card p {
  color: #333;
  font-size: 0.95rem;
}
</style>
