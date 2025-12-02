import { defineStore } from "pinia";
import { accountService } from "@/api/cuenta.service";
import { Grupo } from "@/domain/grupo";
import { Suscripcion } from "@/domain/suscripcion";

type AccountState = {
  saldo: number;
  grupos: Grupo[];
  suscripciones: Suscripcion[];
  loading: boolean;
};

export const useAccountStore = defineStore("account", {
  state: (): AccountState => ({
    saldo: 0,
    grupos: [],
    suscripciones: [],
    loading: false,
  }),

  actions: {
    async userData() {
      this.loading = true;
      try {
        const data = await accountService.getUserData();
        this.saldo = data.saldo ?? 0;
        this.grupos = (data.grupos ?? []).map((g: any) => Grupo.fromDTO(g));
        this.suscripciones = (data.suscripciones ?? []).map((s: any) =>
          Suscripcion.fromDTO(s)
        );
      } finally {
        this.loading = false;
      }
    },
    async createGroup(nombre: string) {
      const data = await accountService.createGroup(nombre);
      // añadimos el grupo ya convertido a dominio
      this.grupos.push(Grupo.fromDTO(data.group));
      return data.group;
    },
  },
});
