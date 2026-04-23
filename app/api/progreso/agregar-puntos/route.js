import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase"; 

export async function POST(req) {
  try {
    const { jugadorId, puntosGanados, runasGeneradas, motivo } = await req.json();

    if (!jugadorId || !puntosGanados || !runasGeneradas || !motivo) {
      return NextResponse.json(
        { error: "Faltan parámetros necesarios" },
        { status: 400 }
      );
    }

    const { data: progreso, error: errorProgreso } = await supabaseAdmin
      .from("progreso_jugador")
      .select("jugador_id, puntos_totales, runas, puntos_residuales")
      .eq("jugador_id", jugadorId)
      .single();

    if (errorProgreso || !progreso) {
      return NextResponse.json(
        { error: "Jugador no encontrado" },
        { status: 404 }
      );
    }

    const puntosTotales = progreso.puntos_totales + puntosGanados;
    const puntosResiduales = progreso.puntos_residuales - puntosGanados;
    const runasTotales = progreso.runas + runasGeneradas;

    const { error: errorActualizar } = await supabaseAdmin
      .from("progreso_jugador")
      .update({
        puntos_totales: puntosTotales,
        runas: runasTotales,
        puntos_residuales: puntosResiduales
      })
      .eq("jugador_id", jugadorId);

    if (errorActualizar) {
      return NextResponse.json(
        { error: "Error al actualizar el progreso del jugador" },
        { status: 500 }
      );
    }

    const { error: errorHistorial } = await supabaseAdmin
      .from("historial_puntos")
      .insert([
        {
          jugador_id: jugadorId,
          puntos_ganados: puntosGanados,
          runas_generadas: runasGeneradas,
          puntos_residuales_antes: progreso.puntos_residuales,
          puntos_residuales_despues: puntosResiduales,
          motivo: motivo
        }
      ]);

    if (errorHistorial) {
      return NextResponse.json(
        { error: "Error al registrar el cambio en el historial" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      valid: true,
      mensaje: "Puntos agregados y registrados correctamente",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}