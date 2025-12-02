<template>
  <div class="faq-page">
    
    <!-- WATERMARK (opcional para estilo Dashboard) -->
    <div class="watermark"></div>

    <!-- HEADER -->
    <header class="faq-header animate-fade">
      <h1 class="faq-title">Preguntas Frecuentes</h1>
      <p class="faq-subtitle">Encuentra respuestas rápidas sobre Fragments y cómo funciona.</p>
    </header>

    <!-- LISTA DE PREGUNTAS -->
    <section class="faq-list animate-fade-delayed">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="faq-item float"
        @click="toggle(index)"
      >
        <div class="faq-question">
          <span>{{ faq.pregunta }}</span>
          <span class="arrow" :class="{ open: faq.abierto }">▼</span>
        </div>

        <div class="faq-answer" v-if="faq.abierto">
          <p>{{ faq.respuesta }}</p>
        </div>
      </div>
    </section>

    <!-- BOTÓN VOLVER -->
    <button class="btn primary back-btn" @click="irDashboard">
      ⬅ Volver
    </button>

  </div>
</template>

<script>
export default {
  name: "FAQView",
  data() {
    return {
      faqs: [
        {
          pregunta: "¿Qué es Fragments?",
          respuesta:
            "Fragments es una plataforma que permite compartir gastos de suscripciones digitales con otros usuarios de forma segura y organizada.",
          abierto: false,
        },
        {
          pregunta: "¿Cómo me uno a un plan?",
          respuesta:
            "Puedes usar el buscador para encontrar planes disponibles. Una vez elijas uno, podrás unirte si hay plazas libres.",
          abierto: false,
        },
        {
          pregunta: "¿Cómo creo una oferta?",
          respuesta:
            "Desde la sección “Crear planes” puedes generar tu propia oferta indicando precio, plataforma y grupo.",
          abierto: false,
        },
        {
          pregunta: "¿Es seguro compartir mis datos?",
          respuesta:
            "Sí. La plataforma utiliza medidas de seguridad avanzadas y solo muestra la información mínima necesaria.",
          abierto: false,
        },
        {
          pregunta: "¿Cómo añado saldo a mi cuenta?",
          respuesta:
            "Puedes añadirlo accediendo a tu cuenta y seleccionando \"Añadir saldo\". Ahí podrás añadir la cantidad que desees de forma rápida.",
          abierto: false,
        }
      ],
    };
  },

  methods: {
    toggle(i) {
      this.faqs[i].abierto = !this.faqs[i].abierto;
    },
    irDashboard() {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
/* === Página general === */
.faq-page {
  padding: 2rem;
  position: relative;
  min-height: 100vh;
  color: #e2e8f0;
}

/* === Encabezado === */
.faq-header {
  text-align: center;
  margin-bottom: 2rem;
}

.faq-title {
  font-size: 2rem;
  color: #c7d2fe;
  text-shadow: 0 0 8px rgba(129, 140, 248, 0.45);
}

.faq-subtitle {
  opacity: 0.8;
}

/* === Items === */
.faq-list {
  max-width: 700px;
  margin: 0 auto;
}

.faq-item {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 1rem;
  padding: 1rem 1.3rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: 0.25s ease;
}

.faq-item:hover {
  transform: translateY(-2px);
  border-color: rgba(129, 140, 248, 0.85);
  box-shadow: 0 8px 22px rgba(0,0,0,0.35);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: #e0e7ff;
}

.arrow {
  transition: transform 0.25s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.faq-answer {
  margin-top: 0.7rem;
  color: #f1f5f9;
  opacity: 0.9;
}

/* === Botón Volver === */
.back-btn {
  margin: 2rem auto 0;
  display: block;
  padding: 0.7rem 1.3rem;
  border-radius: 0.9rem;
  font-weight: 600;
}

/* Animaciones coherentes con Dashboard */
.animate-fade {
  animation: fade 0.4s ease;
}

.animate-fade-delayed {
  animation: fade 0.6s ease;
}

@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
