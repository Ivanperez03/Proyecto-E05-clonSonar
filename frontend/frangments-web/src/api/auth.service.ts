import apiax from "@/apiAxios";
import { User } from "@/domain/user";

export const authService = {
  async login(email: string, password: string) {
    const { data } = await apiax.post("/users/login", { email, password });
    return User.fromDTO(data.user);
  },
  async me() {
    const { data } = await apiax.get("/users/me");
    return User.fromDTO(data.user);
  },
  async logout() {
    await apiax.post("/users/logout");
  },
};
