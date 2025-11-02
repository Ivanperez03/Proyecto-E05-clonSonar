<template>
  <div class="home">
    <!-- HEADER -->
    <header class="header">
      <img src="@/assets/logo_fragments.png" alt="Fragments Logo" class="logo" />
      <nav class="nav">
        <button class="btn-outline" @click="goToSignIn">Sign In</button>
        <button class="btn-primary" @click="goToSignUp">Sign Up</button>
      </nav>
    </header>

    <!-- HERO SECTION -->
    <section class="hero">
      <div class="hero-text">
        <h1>Comparte, conecta y colabora con Fragments</h1>
        <p>
            Fragments es la plataforma definitiva para compartir plataformas y
            conectar con personas afines. Únete a nuestra comunidad y comienza a disfrutar
            de precios más baratos hoy mismo.
        </p>
        <button class="btn-primary large" @click="goToSignUp">Empieza ahora</button>
      </div>

      <div class="hero-image">
        <img src="@/assets/Pets.png" alt="Fragments illustration" />
      </div>
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
/* ====== Layout base ====== */
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff, #8ca6f7);
  font-family: "Inter", sans-serif;
  color: #222;
}

/* ====== Header ====== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background: transparent;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  width: 120px;
}

.nav {
  display: flex;
  gap: 1rem;
}

/* ====== Buttons ====== */
.btn-primary,
.btn-outline {
  border: none;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-primary {
  background-color: #4b6cb7;
  color: white;
}

.btn-primary:hover {
  background-color: #3551a1;
}

.btn-outline {
  background-color: transparent;
  color: #4b6cb7;
  border: 1.5px solid #4b6cb7;
}

.btn-outline:hover {
  background-color: #4b6cb7;
  color: white;
}

.large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* ====== Hero Section ====== */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 3rem 5rem;
  gap: 3rem;
}

.hero-text {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
}

.hero-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.hero-text p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-image {
  flex: 1;
  min-width: 280px;
  display: flex;
  justify-content: center;
}

.hero-image img {
  width: 100%;
  max-width: 420px;
  animation: float 6s ease-in-out infinite;
}

/* ====== Animación flotante ====== */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* ====== Responsive ====== */
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }

  .hero-text h1 {
    font-size: 2rem;
  }

  .hero-image img {
    max-width: 320px;
  }
}
</style>