export class User {
  constructor(
    public id: number,
    public nombre: string,
    public email: string,
    public telefono: string
  ) {}

  static fromDTO(d: any) {
    return new User(d.id ?? d.id_usuario, d.nombre, 
      d.email ?? d.mail, d.telefono);
  }
}
