// src/repositories/alertas.repository.ts
import { db } from "../../config/db";

export interface AlertaRow {
  id_alerta: number;
  id_usuario: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  id_grupo: number | null;
  id_plan: number | null;
  id_transaccion: number | null;
  fecha_creacion: string;   // PG devuelve string ISO
  fecha_leida: string | null;
  metadata: any | null;
}

export interface NuevaAlertaInput {
  id_usuario: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  id_grupo?: number | null;
  id_plan?: number | null;
  id_transaccion?: number | null;
  metadata?: any;
}

/** Devuelve todas las alertas de un usuario, más recientes primero */
export async function findAlertasByUsuario(
  idUsuario: number
): Promise<AlertaRow[]> {
  const { rows } = await db.query<AlertaRow>(
    `
    SELECT *
    FROM alerta
    WHERE id_usuario = $1
    ORDER BY fecha_creacion DESC
    `,
    [idUsuario]
  );
  return rows;
}

/** Marca todas las alertas como leídas para un usuario */
export async function markAllAlertasRead(idUsuario: number): Promise<void> {
  await db.query(
    `
    UPDATE alerta
    SET leida = TRUE,
        fecha_leida = NOW()
    WHERE id_usuario = $1
      AND leida = FALSE
    `,
    [idUsuario]
  );
}

/** Marca UNA alerta como leída; devuelve la fila actualizada o null */
export async function markAlertaRead(
  idAlerta: number,
  idUsuario: number
): Promise<AlertaRow | null> {
  const { rows } = await db.query<AlertaRow>(
    `
    UPDATE alerta
    SET leida = TRUE,
        fecha_leida = NOW()
    WHERE id_alerta = $1
      AND id_usuario = $2
    RETURNING *
    `,
    [idAlerta, idUsuario]
  );

  return rows[0] ?? null;
}

export async function createAlerta(input: NuevaAlertaInput) {
  const {
    id_usuario,
    tipo,
    titulo,
    mensaje,
    id_grupo = null,
    id_plan = null,
    id_transaccion = null,
    metadata = null,
  } = input;

  const { rows } = await db.query(
    `
    INSERT INTO alerta (
      id_usuario, tipo, titulo, mensaje,
      id_grupo, id_plan, id_transaccion,
      metadata
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [id_usuario, tipo, titulo, mensaje, id_grupo, id_plan, id_transaccion, metadata]
  );

  return rows[0];
}