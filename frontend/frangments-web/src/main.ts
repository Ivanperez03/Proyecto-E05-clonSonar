import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "@/assets/main.css"
import "@/assets/global.css";

import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia()).use(router).mount("#app");
