<template>
  <div class="dash">
    <h2>Panel Fragments</h2>
    <p class="subtitle">Welcome.</p>

    <section class="cards">
      <article class="card">
        <h3>Usuarios</h3>
        <p>{{ users.length }}</p>
      </article>
      <article class="card">
        <h3>Grupos</h3>
        <p>0</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const users = ref<any[]>([]);

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/users");
    users.value = await res.json();
  } catch (err) {
    console.error("Error cargando usuarios", err);
  }
});
</script>

<style scoped>
.dash {
  padding: 2rem;
}
.subtitle {
  color: #94a3b8;
  margin-bottom: 1.5rem;
}
.cards {
  display: flex;
  gap: 1rem;
}
.card {
  background: #1f2937;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  min-width: 180px;
}
</style>
