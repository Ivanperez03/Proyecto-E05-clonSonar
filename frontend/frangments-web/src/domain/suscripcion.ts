export class Suscripcion {
  constructor(
    public id: number,
    public nombre: string,           // nombre de la plataforma
    public precio: number,
    public fechaVencimiento: string, 
  ) {}

  static fromDTO(d: any) {
    return new Suscripcion(
      d.id,
      d.nombre ?? d.plataforma,     
      d.precio_plan,
      d.fecha_vencimiento,
    );
  }
}
