import { db } from "../../config/db";
import { planSubRepo } from "../plan_sub/plan_sub.repositoy";
import { transaccionRepo } from "../transaccion/transaccion.repository";
import { carteraRepo } from "../cartera/cartera.repository";
import { miembroGrupoRepo } from "../miembro_grupo/miembro_grupo.repository";
import { grupoRepo } from "../grupo/grupo.repository";
import { createAlerta } from "../alertas/alertas.repository";

const MS_31D = 31 * 24 * 60 * 60 * 1000;

function debeCobrarAhora(
  fechaInicioCobro: Date,
  ultimaFechaCobro?: Date | null
): boolean {
  // Si nunca se ha cobrado este plan, COBRAMOS AHORA
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
    console.log("🔁 Iniciando proceso de cobro...");

    const planes = await planSubRepo.getAllActivePlans();
    console.log(`📦 Planes activos encontrados: ${planes.length}`);

    const ahora = new Date();

    for (const plan of planes) {
      console.log(`\n▶️ Evaluando plan ${plan.id_plan} (grupo ${plan.id_grupo})`);

      const fechaInicio = new Date(plan.fecha_inicio_cobro);
      const ultimaTrans = await transaccionRepo.getLastByPlanId(plan.id_plan);
      const ultimaFechaCobro = ultimaTrans ? new Date(ultimaTrans.fecha_trans) : null;

      console.log(`   - fecha_inicio_cobro: ${fechaInicio.toISOString()}`);
      console.log(`   - última fecha cobro: ${ultimaFechaCobro?.toISOString() ?? "NUNCA"}`);

      if (!debeCobrarAhora(fechaInicio, ultimaFechaCobro)) {
        console.log("   ⏭ No toca cobrar todavía este plan");
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
      const cuota = Number((plan.precio_plan / miembros.length).toFixed(2));
      console.log(`   💰 Cuota por usuario: ${cuota}€`);

      for (const m of miembros) {
        console.log(`   -> Procesando miembro ${m.id_usuario}`);
        await db.query("BEGIN");
        try {
          const carteraUsuario = await carteraRepo.findByUserId(m.id_usuario);
          console.log(`      Saldo actual: ${carteraUsuario?.saldo ?? "SIN CARTERA"}`);

            if (!carteraUsuario || carteraUsuario.saldo < cuota) {
              console.log("      ❌ Saldo insuficiente, expulsando del grupo");
            
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
                metadata: { cuota, fecha_intento: ahora.toISOString() },
              });
          
              await db.query("COMMIT");
              continue;
            }

            console.log("      ✅ Cobro correcto, actualizando saldos y registrando transacción");

            // Restar saldo al usuario y sumar al jefe
            await carteraRepo.updateSaldoDelta(m.id_usuario, -cuota);
            await carteraRepo.updateSaldoDelta(idJefe, cuota);

            // Registrar transacción
            const trans = await transaccionRepo.create({
              id_plan_sub: plan.id_plan,
              id_usuario_origen: m.id_usuario,
              id_usuario_final: idJefe,
              precio: cuota,
              comision: 0,
            });

            // Alerta de cobro correcto
            await createAlerta({
              id_usuario: m.id_usuario,
              tipo: "COBRO_SUSCRIPCION",
              titulo: "Suscripción cobrada",
              mensaje: `Se han cobrado ${cuota.toFixed(2)}€ por la suscripción del grupo "${grupo.nombre}".`,
              id_grupo: plan.id_grupo,
              id_plan: plan.id_plan,
              id_transaccion: trans.id_transaccion,
              metadata: { cuota, fecha_cobro: trans.fecha_trans },
            });

            await db.query("COMMIT");

          console.log("      ✅ Cobro correcto, actualizando saldos y registrando transacción");
          // update saldos + transaccion + alerta...
          await db.query("COMMIT");
        } catch (err) {
          console.error("      💣 Error al cobrar a usuario", m.id_usuario, err);
          await db.query("ROLLBACK");
        }
      }
    }

    console.log("✅ Proceso de cobro terminado");
  },
};
