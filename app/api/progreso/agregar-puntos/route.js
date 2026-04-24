import { supabaseAdmin } from "@/lib/supabase";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { codigo, puntos_ganados, motivo } = body ?? {};

    if (!codigo || typeof codigo !== "string") {
      return Response.json(
        { ok: false, error: "Código inválido" },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (
      puntos_ganados === undefined ||
      typeof puntos_ganados !== "number" ||
      puntos_ganados <= 0
    ) {
      return Response.json(
        { ok: false, error: "puntos_ganados inválido" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const { data, error } = await supabaseAdmin.rpc("agregar_puntos_por_codigo", {
      p_codigo_jugador: codigo,
      p_puntos_ganados: puntos_ganados,
      p_motivo: motivo ?? null,
    });

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    if (!data || data.length === 0) {
      return Response.json(
        { ok: false, error: "No se pudo actualizar el progreso" },
        { status: 404, headers: corsHeaders() }
      );
    }

    const progreso = data[0];

    return Response.json(
      {
        ok: true,
        jugador_id: progreso.jugador_id,
        puntos_totales: progreso.puntos_totales,
        runas: progreso.runas,
        puntos_residuales: progreso.puntos_residuales,
        runas_generadas: progreso.runas_generadas,
      },
      {
        status: 200,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error.message || "Error interno del servidor",
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}