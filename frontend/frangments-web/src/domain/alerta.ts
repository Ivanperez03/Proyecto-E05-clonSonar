export class Alerta {
  id: number;
  mensaje: string;
  tipo: string;
  vista: boolean;
  fecha: string | null;
  createdAt?: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.mensaje = dto.mensaje;
    this.tipo = dto.tipo ?? "sistema";
    this.vista = dto.vista ?? false;
    this.fecha = dto.fecha ?? null;
    this.createdAt = dto.createdAt;
  }

  static fromDTO(dto: any): Alerta {
    return new Alerta(dto);
  }
}