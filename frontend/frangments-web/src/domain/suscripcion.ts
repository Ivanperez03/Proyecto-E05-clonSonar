export class Suscripcion {
  constructor(
    public id: number,
    public nombre: string,           
    public precio: number,           
    public fechaVencimiento: string,
    public proximoCobro: string,
  ) {}

  static fromDTO(d: any) {
    return new Suscripcion(
      d.id_plan ?? d.id,
      d.nombre_grupo ?? d.plataforma ?? d.nombre,
      d.precio_usuario ?? d.precio_plan,
      d.fecha_vencimiento,
      d.proximo_cobro,
    );
  }
}
