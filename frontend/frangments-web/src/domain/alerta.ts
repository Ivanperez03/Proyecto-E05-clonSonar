export class Alerta {
  constructor(
    public id: number,
    public mensaje: string,
    public tipo: string,
    public vista: boolean,
    public fecha: string,
    public createdAt: string
  ) {}

  static fromDTO(dto: any): Alerta {
    return new Alerta(
      dto.id,
      dto.mensaje,
      dto.tipo,
      dto.vista ?? false,                    
      dto.fecha ?? dto.createdAt,
      dto.createdAt ?? dto.fecha
    );
  }
}
