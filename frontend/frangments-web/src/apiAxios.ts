import axios from "axios";

const apiax = axios.create({
  baseURL: "/api",
  withCredentials: true, // 🔥 importante para enviar y recibir cookies
});

export default apiax;
