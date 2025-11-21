<template>
  <div class="ofertar">
    <header class="header">
      <h2>Publicar una nueva oferta</h2>
      <p class="subtitle">Crea una oferta y compártela con la comunidad</p>
    </header>

    <form class="form" @submit.prevent="crearOferta">
      <!-- Plataforma -->
      <div class="form-group">
        <label for="plataforma">Plataforma del plan</label>
        <select id="plataforma" v-model.number="form.plataforma" required>
          <option disabled value="">Selecciona una plataforma</option>
          <option v-for="p in plataformas" :key="p.id_plataforma" :value="p.id_plataforma">
            {{ p.nombre }}
          </option>
        </select>
      </div>

      <!-- Precio -->
      <div class="form-group">
        <label for="precio">Precio (€)</label>
        <input
          type="number"
          id="precio"
          v-model.number="form.precio"
          placeholder="Introduce el precio"
          required
          min="0"
          step="0.01"
        />
      </div>

      <!-- Fecha de vencimiento -->
      <div class="form-group">
        <label for="fecha_vencimiento">Fecha de vencimiento</label>
        <input
          type="date"
          id="fecha_vencimiento"
          v-model="form.fecha_vencimiento"
          required
        />
      </div>

      <!-- Elegir entre grupo existente o nuevo -->
      <div class="form-group">
        <label>¿Qué deseas hacer?</label>
        <div class="radio-group">
          <label>
            <input type="radio" value="existente" v-model="opcion" /> Grupo existente
          </label>
          <label>
            <input type="radio" value="nuevo" v-model="opcion" /> Crear nuevo grupo
          </label>
        </div>
      </div>

      <!-- Grupo existente -->
      <div class="form-group" v-if="opcion === 'existente'">
        <label>Selecciona un grupo existente</label>
        <select v-model.number="form.id_grupo">
          <option disabled value="">Selecciona un grupo</option>
          <option v-for="g in grupos" :key="g.id_grupo" :value="g.id_grupo">
            {{ g.nombre }}
          </option>
        </select>
      </div>

      <!-- Nuevo grupo -->
      <div class="form-group" v-if="opcion === 'nuevo'">
        <label>Nombre del nuevo grupo</label>
        <input
          type="text"
          v-model="form.nuevo_grupo"
          placeholder="Escribe el nombre del grupo"
        />
      </div>

      <!-- Botones -->
      <div class="botones">
        <button class="btn publicar" type="submit">Publicar oferta</button>
        <button type="button" class="btn back" @click="volverDashboard">⬅ Volver</button>
      </div>
    </form>

    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiax from "@/apiAxios";

const router = useRouter();

const grupos = ref<Array<{ id_grupo: number; nombre: string }>>([]);
const plataformas = ref<Array<{ id_plataforma: number; nombre: string }>>([]);

const form = ref({
  plataforma: "" as number | "",
  precio: null as number | null,
  fecha_vencimiento: "",
  id_grupo: "" as number | "",
  nuevo_grupo: "",
});

const opcion = ref("existente");
const mensaje = ref("");

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");

    // Traer grupos
    const respGrupos = await apiax.get("/grupo/mis-grupos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    grupos.value = respGrupos.data;

    // Traer plataformas
    const respPlataformas = await apiax.get("/plataforma", {
      headers: { Authorization: `Bearer ${token}` },
    });
    plataformas.value = respPlataformas.data;
  } catch (error) {
    console.error("Error cargando grupos o plataformas:", error);
    mensaje.value = "❌ Error al cargar los grupos o plataformas";
  }
});

async function crearOferta() {
  if (
    !form.value.plataforma ||
    !form.value.precio ||
    !form.value.fecha_vencimiento ||
    (opcion.value === "existente" && !form.value.id_grupo) ||
    (opcion.value === "nuevo" && !form.value.nuevo_grupo)
  ) {
    mensaje.value = "Por favor completa todos los campos";
    return;
  }

  try {
    const token = localStorage.getItem("token");
    let id_grupo_final = form.value.id_grupo;

    // Crear nuevo grupo si se seleccionó esa opción
    if (opcion.value === "nuevo") {
      const respNuevoGrupo = await apiax.post(
        "/grupos",
        { nombre: form.value.nuevo_grupo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      id_grupo_final = respNuevoGrupo.data.group.id_grupo;
    }

    // Publicar oferta
    await apiax.post(
      "/plan_sub/subscribe",
      {
        id_plataforma: Number(form.value.plataforma),
        precio: form.value.precio,
        fecha_vencimiento: form.value.fecha_vencimiento,
        id_grupo: Number(id_grupo_final),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    mensaje.value = "✅ Oferta publicada con éxito";
    form.value = { plataforma: "", precio: null, fecha_vencimiento: "", id_grupo: "", nuevo_grupo: "" };
    opcion.value = "existente";
  } catch (error: any) {
    console.error(error);
    mensaje.value = error.response?.data?.message || "❌ Error al publicar la oferta";
  }
}

function volverDashboard() {
  router.push({ name: "dashboard" });
}
</script>

<style scoped>
.ofertar {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: linear-gradient(120deg, #e0f2ff, #a2b8d9, #1e293b);
  font-family: "Inter", sans-serif;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.header { text-align: center; }
.header h2 { font-size: 2rem; font-weight: 800; color: #111827; }
.subtitle { color: #4b5563; font-size: 0.95rem; margin-top: 0.4rem; }
.form {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  padding: 2.2rem 2.5rem;
  border-radius: 1.3rem;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
label { font-weight: 600; font-size: 0.9rem; color: #1f2937; }
input, select {
  padding: 0.8rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  background: #f9fafb;
}
input:focus, select:focus {
  border-color: #4b6cb7;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25);
}
.radio-group { display: flex; gap: 1rem; }
.radio-group label { font-weight: normal; font-size: 0.95rem; }
.botones { display: flex; justify-content: space-between; gap: 1rem; margin-top: 0.5rem; }
.btn { flex: 1; font-weight: 600; border: none; border-radius: 0.9rem; padding: 0.85rem 1rem; cursor: pointer; }
.btn.publicar { background: linear-gradient(135deg, #2563eb, #4f46e5); color: #fff; }
.btn.back { background: #e5e7eb; color: #111827; }
.mensaje {
  margin-top: 1.25rem;
  font-weight: 600;
  color: #111827;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.9rem 1.1rem;
  border-radius: 0.9rem;
}
</style>
