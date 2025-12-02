import axios from "axios";

const apiax = axios.create({
  baseURL: "/api",
  withCredentials: true, 
});

export default apiax;
