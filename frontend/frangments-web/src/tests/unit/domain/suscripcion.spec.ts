import { describe, it, expect } from "vitest";
import { Suscripcion } from "@/domain/suscripcion";

describe("Suscripcion.fromDTO", () => {
  it("mapea correctamente cuando viene 'nombre'", () => {
    const dto = {
      id: 1,
      nombre: "Spotify",
      precio_plan: 3.5,
      fecha_vencimiento: "2025-12-31",
    };

    const sub = Suscripcion.fromDTO(dto);

    expect(sub.id).toBe(1);
    expect(sub.nombre).toBe("Spotify");
    expect(sub.precio).toBe(3.5);
    expect(sub.fechaVencimiento).toBe("2025-12-31");
  });

  it("usa 'plataforma' como nombre si 'nombre' no viene", () => {
    const dto = {
      id: 2,
      plataforma: "Netflix",
      precio_plan: 9.99,
      fecha_vencimiento: "2025-11-01",
    };

    const sub = Suscripcion.fromDTO(dto);

    expect(sub.nombre).toBe("Netflix");
    expect(sub.precio).toBe(9.99);
  });
});
