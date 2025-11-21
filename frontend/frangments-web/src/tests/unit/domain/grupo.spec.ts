import { describe, it, expect } from "vitest";
import { Grupo } from "@/domain/grupo";

describe("Grupo.fromDTO", () => {
  it("mapea correctamente un DTO completo con id_grupo y estado", () => {
    const dto = {
      id_grupo: 10,
      nombre: "Grupo Spotify",
      estado: "cerrado",
      id_jefe: 3,
    };

    const grupo = Grupo.fromDTO(dto);

    expect(grupo.id).toBe(10);
    expect(grupo.nombre).toBe("Grupo Spotify");
    expect(grupo.estado).toBe("cerrado");
    expect(grupo.id_jefe).toBe(3);
  });

  it("usa 'abierto' como estado por defecto si no viene en el DTO", () => {
    const dto = {
      id_grupo: 2,
      nombre: "Grupo Netflix",
      id_jefe: 5,
    };

    const grupo = Grupo.fromDTO(dto);

    expect(grupo.estado).toBe("abierto");
  });

  it("acepta id en lugar de id_grupo", () => {
    const dto = {
      id: 7,
      nombre: "Grupo Prime",
      estado: "abierto",
      id_jefe: 9,
    };

    const grupo = Grupo.fromDTO(dto);

    expect(grupo.id).toBe(7);
  });
});
