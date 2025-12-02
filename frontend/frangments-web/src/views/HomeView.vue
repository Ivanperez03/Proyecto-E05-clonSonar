<template>
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-text">
        <h1>
          Comparte gastos de streaming
        </h1>
        <h1>
          sin complicaciones
        </h1>
        <p class="hero-subtitle">
          Únete a Fragments y descubre una nueva forma de compartir planes, gestionar grupos
          y acceder a tus plataformas favoritas al menor precio.
        </p>
        <div class="hero-actions">
          <button class="btn primary big" @click="goToSignUp">
            Empieza ahora
          </button>
          <button class="btn ghost" @click="goToSignIn">
            Ya tengo cuenta
          </button>
        </div>
      </div>

      <div class="hero-image">
        <img src="@/assets/new_logo_Fragments.png" alt="Logo Fragments" />
      </div>
    </section>

    <!-- CARDS -->
    <section class="cards">
      <div class="feature-stepper">
        <!-- Radios ocultos para el “paginador” -->
        <input type="radio" id="feat1" name="feature" class="step-radio" checked>
        <input type="radio" id="feat2" name="feature" class="step-radio">
        <input type="radio" id="feat3" name="feature" class="step-radio">
      
        <!-- Contenido “tipo página” -->
        <div class="feature-panels">
          <!-- Paso 1 -->
          <div class="feature-panel feature-1">
            <p class="step-label">Paso 1 · Descubre</p>
            <h2>Encuentra planes</h2>
            <p>Explora ofertas creadas por otros usuarios y únete a grupos activos.</p>
          
            <div class="feature-footer">
              <div class="feature-dots">
                <label for="feat1" class="dot"></label>
                <label for="feat2" class="dot"></label>
                <label for="feat3" class="dot"></label>
              </div>
              <label for="feat2" class="feature-next">
                Siguiente &rsaquo;
              </label>
            </div>
          </div>
        
          <!-- Paso 2 -->
          <div class="feature-panel feature-2">
            <p class="step-label">Paso 2 · Publica</p>
            <h2>Crea tus ofertas</h2>
            <p>Publica tus propios planes y consigue nuevos compañeros de suscripción.</p>
          
            <div class="feature-footer">
              <div class="feature-dots">
                <label for="feat1" class="dot"></label>
                <label for="feat2" class="dot"></label>
                <label for="feat3" class="dot"></label>
              </div>
              <label for="feat3" class="feature-next">
                Siguiente &rsaquo;
              </label>
            </div>
          </div>
        
          <!-- Paso 3 -->
          <div class="feature-panel feature-3">
            <p class="step-label">Paso 3 · Gestiona</p>
            <h2>Gestiona tus grupos</h2>
            <p>Administra grupos, pagos, suscripciones y tu saldo fácilmente.</p>
          
            <div class="feature-footer">
              <div class="feature-dots">
                <label for="feat1" class="dot"></label>
                <label for="feat2" class="dot"></label>
                <label for="feat3" class="dot"></label>
              </div>
              <label for="feat1" class="feature-next">
                Volver al inicio &rsaquo;
              </label>
            </div>
          </div>
        </div>
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
/* ===== GENERAL ===== */
.home {
  min-height: 100vh;
  padding: 1.8rem 2.2rem 2.5rem;
  background: linear-gradient(135deg, #e0f2ff 0%, #c4d7ff 40%, #0f172a 100%);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* ===== TOPBAR ===== */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo {
  width: 160px;
  height: auto;
}

/* ===== BUTTONS ===== */
.btn {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 0.7rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease,
    color 0.2s ease, border-color 0.2s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #4f46e5, #22d3ee);
  color: white;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(30, 64, 175, 0.5);
}

.btn.secondary {
  background: rgba(15, 23, 42, 0.1);
  color: #111827;
  border: 1px solid rgba(148, 163, 184, 0.7);
  backdrop-filter: blur(10px);
}

.btn.secondary:hover {
  background: rgba(15, 23, 42, 0.18);
}

.btn.ghost {
  background: transparent;
  color: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.7);
}

.btn.ghost:hover {
  background: rgba(255, 255, 255, 0.7);
}

.btn.big {
  padding: 0.9rem 2.1rem;
  font-size: 1.05rem;
}

/* ===== HERO SECTION ===== */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: center;
  gap: 3rem;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.hero-kicker {
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.7);
}

.hero-text h1 {
  font-size: 3.1rem;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(120deg, #1e293b, #312e81);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: rgba(15, 23, 42, 0.86);
  max-width: 520px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.hero-image {
  display: flex;
  justify-content: center;
}

.hero-image img {
  width: 100%;
  max-width: 420px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* ===== CARDS ===== */
/* ===== STEP CARDS (sin rectángulo gordo) ===== */
.cards {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.feature-stepper {
  width: 100%;
  max-width: 960px;
}

/* radios ocultos */
.step-radio {
  display: none;
}

.feature-panels {
  position: relative;
  padding: 1.8rem 2rem 1.6rem;
  border-radius: 1.4rem;

  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.25),
    rgba(30, 41, 59, 0.28)
  );

  box-shadow: 0 22px 45px rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  overflow: hidden;
  min-height: 150px;
}


/* cada "página" */
.feature-panel {
  position: absolute;
  inset: 1.4rem 2rem;
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.feature-panel h2 {
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
  color: #f9fafb;
}

.feature-panel p {
  margin: 0;
  font-size: 0.95rem;
  color: #cbd5f5;
}

.step-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(148, 163, 184, 0.9);
  margin-bottom: 0.4rem;
}

/* footer con puntos + botón siguiente */
.feature-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.4rem;
  gap: 1rem;
}

.feature-dots {
  display: flex;
  gap: 0.4rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.9);
  background: transparent;
  cursor: pointer;
}

/* botón "siguiente >" */
.feature-next {
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e0f2ff;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.7);
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-next:hover {
  background: rgba(15, 23, 42, 0.85);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.5);
}

/* ==== lógica de "página" con solo CSS ==== */
#feat1:checked ~ .feature-panels .feature-1,
#feat2:checked ~ .feature-panels .feature-2,
#feat3:checked ~ .feature-panels .feature-3 {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  position: relative;
}

/* dot activo segun radio */
#feat1:checked ~ .feature-panels .feature-1 .feature-dots label:nth-child(1),
#feat2:checked ~ .feature-panels .feature-2 .feature-dots label:nth-child(2),
#feat3:checked ~ .feature-panels .feature-3 .feature-dots label:nth-child(3) {
  background: #38bdf8;
  border-color: #38bdf8;
}

/* responsive */
@media (max-width: 768px) {
  .feature-panels {
    padding: 1.6rem 1.4rem 1.4rem;
  }

  .feature-panel {
    inset: 1rem 1.2rem;
  }
}


/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .home {
    padding: 1.5rem 1.4rem 2.2rem;
  }

  .hero {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .hero-image {
    order: -1;
  }

  .hero-text h1 {
    font-size: 2.5rem;
  }
}
</style>
