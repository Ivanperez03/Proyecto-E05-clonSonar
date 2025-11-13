export class Grupo {
  constructor(
    public id: number,
    public nombre: string,
    public estado: string,
    public id_jefe: number,
  ) {}

  static fromDTO(d: any) {
    return new Grupo(
      d.id_grupo ?? d.id,
      d.nombre,
      d.estado ?? "abierto",
      d.id_jefe,
    );
  }
}
