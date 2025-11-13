import apiax from "@/apiAxios";

export const accountService = {
  async getUserData() {
    const { data } = await apiax.get("/user/data");
    return data; // { user, saldo, grupos, suscripciones }
  },

  async createGroup(nombre: string) {
    const { data } = await apiax.post("/grupo", { nombre });
    return data; // { message, group }
  },
};
