import { db } from "../../config/db";
import { planSubRepo } from "../plan_sub/plan_sub.repositoy";
import { transaccionRepo } from "../transaccion/transaccion.repository";
import { carteraRepo } from "../cartera/cartera.repository";
import { miembroGrupoRepo } from "../miembro_grupo/miembro_grupo.repository";
import { grupoRepo } from "../grupo/grupo.repository";
import { createAlerta } from "../alertas/alertas.repository";
import { userRepo } from "../users/user.repository";

const MS_31D = 31 * 24 * 60 * 60 * 1000;
const WARNING_WINDOW_MS = 3 * 24 * 60 * 60 * 1000; // 3 días antes del cobro

function calcularProximoCobro(
  fechaInicioCobro: Date,
  ultimaFechaCobro?: Date | null
): Date {
  const anchor = (ultimaFechaCobro ?? fechaInicioCobro).getTime();
  return new Date(anchor + MS_31D);
}

function debeCobrarAhora(
  _fechaInicioCobro: Date,
  ultimaFechaCobro?: Date | null
): boolean {
  // Si nunca se ha cobrado este plan, cobramos ahora
  if (!ultimaFechaCobro) {
    return true;
  }

  // A partir del primer cobro, cada 31 días desde el último cobro
  const ahora = Date.now();
  const anchor = ultimaFechaCobro.getTime();
  const siguiente = anchor + MS_31D;
  return ahora >= siguiente;
}

export const billingService = {
  async runBillingNow() {
    console.log(" Iniciando proceso de cobro...");

    // Usuario plataforma (para la comisión)
    const admin = await userRepo.findByEmail("administrador@admin");
    const adminId = admin?.id_usuario ?? null;
    if (!adminId) {
      console.warn(
        " No se encontró usuario administrador@admin, la plataforma no recibirá comisión"
      );
    }

    const planes = await planSubRepo.getAllActivePlans();
    console.log(`Planes activos encontrados: ${planes.length}`);

    const ahora = new Date();

    for (const plan of planes) {
      console.log(`\n Evaluando plan ${plan.id_plan} (grupo ${plan.id_grupo})`);

      const fechaInicio = new Date(plan.fecha_inicio_cobro);
      const ultimaTrans = await transaccionRepo.getLastByPlanId(plan.id_plan);
      const ultimaFechaCobro = ultimaTrans ? new Date(ultimaTrans.fecha_trans) : null;

      console.log(`   - fecha_inicio_cobro: ${fechaInicio.toISOString()}`);
      console.log(
        `   - última fecha cobro: ${ultimaFechaCobro?.toISOString() ?? "NUNCA"}`
      );

      if (!debeCobrarAhora(fechaInicio, ultimaFechaCobro)) {
        console.log("   ⏭ No toca cobrar todavía este plan");
        continue;
      }

      const grupo = await grupoRepo.findById(plan.id_grupo);
      if (!grupo) {
        console.log("   Grupo no encontrado, salto");
        continue;
      }

      const miembros = await miembroGrupoRepo.getMembersByGroup(plan.id_grupo);
      console.log(`   Miembros en el grupo: ${miembros.length}`);
      if (!miembros.length) continue;

      const idJefe = grupo.id_jefe;
      if (!idJefe) {
        console.log("   Grupo sin jefe definido, salto");
        continue;
      }

      const totalSlots = miembros.length;

      // Si solo está el jefe (o menos), no hay a quién cobrar
      if (totalSlots <= 1) {
        console.log("   Solo está el jefe en el grupo, no hay cobro que hacer");
        continue;
      }

      const cuotaBase = Number((plan.precio_plan / totalSlots).toFixed(2));

      console.log(`   Cuota base por plaza: ${cuotaBase}€`);
      console.log("   Esquema: usuario +15%, jefe +10%, plataforma +5%");

      for (const m of miembros) {
        console.log(`   -> Procesando miembro ${m.id_usuario}`);

        // El jefe no paga, solo cobra de los demás
        if (m.id_usuario === idJefe) {
          console.log("      Jefe detectado — no paga, solo cobra de los demás");
          continue;
        }

        // Cálculos económicos
        const base = cuotaBase;
        const usuarioPaga = Number((base * 1.15).toFixed(2));
        const jefeRecibe = Number((base * 1.10).toFixed(2));  
        const plataformaRecibe = Number(
          (usuarioPaga - jefeRecibe).toFixed(2)
        ); // resto para la plataforma

        console.log(`      Usuario pagará: ${usuarioPaga}€`);
        console.log(`      Jefe recibe: ${jefeRecibe}€`);
        console.log(`      Plataforma recibe: ${plataformaRecibe}€`);

        await db.query("BEGIN");
        try {
          const carteraUsuario = await carteraRepo.findByUserId(m.id_usuario);
          console.log(
            `      Saldo actual: ${carteraUsuario?.saldo ?? "SIN CARTERA"}`
          );

          // Validar saldo suficiente para el importe total que paga el usuario
          if (!carteraUsuario || carteraUsuario.saldo < usuarioPaga) {
            console.log(
              "      Saldo insuficiente, expulsando del grupo");


            // Quitar del grupo
            await miembroGrupoRepo.removeMember(plan.id_grupo, m.id_usuario);

            // Crear alerta de expulsión
            await createAlerta({
              id_usuario: m.id_usuario,
              tipo: "EXPULSION_SUSCRIPCION",
              titulo: "Has sido expulsado de un grupo",
              mensaje: `Has sido expulsado del grupo "${grupo.nombre}" por falta de saldo para pagar la suscripción.`,
              id_grupo: plan.id_grupo,
              id_plan: plan.id_plan,
              metadata: {
                cuota_base: base,
                usuario_paga: usuarioPaga,
                fecha_intento: ahora.toISOString(),
              },
            });

            await db.query("COMMIT");
            continue;
          }

          console.log(
            "      Cobro correcto, actualizando saldos y registrando transacción"
          );

          // restar saldo al usuario (importe total)
          await carteraRepo.updateSaldoDelta(m.id_usuario, -usuarioPaga);

          // sumar al jefe su parte (base + 10%)
          await carteraRepo.updateSaldoDelta(idJefe, jefeRecibe);

          // sumar a la plataforma su comisión, si existe admin
          if (adminId) {
            await carteraRepo.updateSaldoDelta(adminId, plataformaRecibe);
          }

          // Registrar transacción: lo que paga el usuario y la comisión
          const trans = await transaccionRepo.create({
            id_plan_sub: plan.id_plan,
            id_usuario_origen: m.id_usuario,
            id_usuario_final: idJefe,
            precio: usuarioPaga,
            comision: plataformaRecibe,
          });

          // Alerta de cobro correcto
          await createAlerta({
            id_usuario: m.id_usuario,
            tipo: "COBRO_SUSCRIPCION",
            titulo: "Suscripción cobrada",
            mensaje: `Se han cobrado ${usuarioPaga.toFixed(
              2
            )}€ por la suscripción del grupo "${grupo.nombre}".`,
            id_grupo: plan.id_grupo,
            id_plan: plan.id_plan,
            id_transaccion: trans.id_transaccion,
            metadata: {
              cuota_base: base,
              usuario_paga: usuarioPaga,
              jefe_recibe: jefeRecibe,
              plataforma_recibe: plataformaRecibe,
              fecha_cobro: trans.fecha_trans,
            },
          });

          await db.query("COMMIT");
        } catch (err) {
          console.error(
            "      💣 Error al cobrar a usuario",
            m.id_usuario,
            err
          );
          await db.query("ROLLBACK");
        }
      }
    }

    console.log("Proceso de cobro terminado");
  },

async checkLowBalance() {
    console.log("🔍 Iniciando chequeo de saldo bajo...");

    const planes = await planSubRepo.getAllActivePlans();
    console.log(`📦 Planes activos encontrados: ${planes.length}`);

    const ahora = Date.now();

    for (const plan of planes) {
      console.log(`\n▶️ Evaluando plan ${plan.id_plan} (grupo ${plan.id_grupo})`);

      const fechaInicio = new Date(plan.fecha_inicio_cobro);
      const ultimaTrans = await transaccionRepo.getLastByPlanId(plan.id_plan);
      const ultimaFechaCobro = ultimaTrans ? new Date(ultimaTrans.fecha_trans) : null;

      const proximoCobro = calcularProximoCobro(fechaInicio, ultimaFechaCobro);
      const diffMs = proximoCobro.getTime() - ahora;

      console.log(`   - Próximo cobro previsto: ${proximoCobro.toISOString()}`);

      // Si ya se pasó o falta más de 3 días, no avisamos
      if (diffMs <= 0 || diffMs > WARNING_WINDOW_MS) {
        console.log("   ⏭ No entra en ventana de aviso de saldo bajo");
        continue;
      }

      const grupo = await grupoRepo.findById(plan.id_grupo);
      if (!grupo) {
        console.log("   ⚠️ Grupo no encontrado, salto");
        continue;
      }

      const miembros = await miembroGrupoRepo.getMembersByGroup(plan.id_grupo);
      console.log(`   👥 Miembros en el grupo: ${miembros.length}`);
      if (!miembros.length) continue;

      const idJefe = grupo.id_jefe;
      if (!idJefe) {
        console.log("   ⚠️ Grupo sin jefe definido, salto");
        continue;
      }

      const totalSlots = miembros.length;
      if (totalSlots <= 1) {
        console.log("   ⚠️ Solo está el jefe, no hay a quién avisar");
        continue;
      }

      const cuotaBase = Number((plan.precio_plan / totalSlots).toFixed(2));
      console.log(`   💰 Cuota base por plaza: ${cuotaBase}€`);

      for (const m of miembros) {
        if (m.id_usuario === idJefe) {
          console.log(`   -> Miembro ${m.id_usuario} es jefe, salto`);
          continue;
        }

        const base = cuotaBase;
        const usuarioPaga = Number((base * 1.15).toFixed(2)); // lo que SE LE COBRARÁ
        const carteraUsuario = await carteraRepo.findByUserId(m.id_usuario);
        const saldo = carteraUsuario?.saldo ?? 0;

        console.log(
          `   -> Usuario ${m.id_usuario} — saldo: ${saldo}€, necesita: ${usuarioPaga}€`
        );

        if (saldo >= usuarioPaga) {
          console.log("      ✅ Tiene saldo suficiente, sin alerta");
          continue;
        }

        // 🔔 Crear alerta de saldo bajo (AVISO PREVIO, sin expulsar)
        await createAlerta({
          id_usuario: m.id_usuario,
          tipo: "SALDO_BAJO",
          titulo: "Tu saldo es insuficiente para la próxima suscripción",
          mensaje: `Tu saldo actual es de ${saldo.toFixed(
            2
          )}€, pero necesitas ${usuarioPaga.toFixed(
            2
          )}€ para el próximo cobro del grupo "${grupo.nombre}". Añade saldo para evitar ser expulsado cuando llegue el cobro.`,
          id_grupo: plan.id_grupo,
          id_plan: plan.id_plan,
          metadata: {
            saldo_actual: saldo,
            importe_necesario: usuarioPaga,
            cuota_base: base,
            fecha_proximo_cobro: proximoCobro.toISOString(),
          },
        });

        console.log("      ⚠️ Alerta SALDO_BAJO creada para el usuario");
      }
    }

    console.log("✅ Chequeo de saldo bajo terminado");
  },
};