import { describe, it, expect } from "vitest";
import { User } from "@/domain/user";

describe("User.fromDTO", () => {
  it("mapea DTO con id_usuario y mail", () => {
    const dto = {
      id_usuario: 5,
      nombre: "Oscar",
      mail: "oscar@test.com",
      telefono: "123456789",
      tipo: "normal",
    };
    const user = User.fromDTO(dto);
    expect(user.id).toBe(5);
    expect(user.nombre).toBe("Oscar");
    expect(user.email).toBe("oscar@test.com");
    expect(user.telefono).toBe("123456789");
    expect(user.tipo).toBe("normal");
  });

  it("mapea DTO con id y email", () => {
    const dto = {
      id: 8,
      nombre: "Ana",
      email: "ana@test.com",
      telefono: "987654321",
      tipo: "admin",
    };

    const user = User.fromDTO(dto);

    expect(user.id).toBe(8);
    expect(user.email).toBe("ana@test.com");
  });
});
