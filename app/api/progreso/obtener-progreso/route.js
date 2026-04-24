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
    const { codigo } = body ?? {};

    if (!codigo || typeof codigo !== "string") {
      return Response.json(
        { ok: false, error: "Código inválido" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const { data, error } = await supabaseAdmin.rpc("obtener_progreso_por_codigo", {
      p_codigo_jugador: codigo,
    });

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    if (!data || data.length === 0) {
      return Response.json(
        { ok: false, error: "Jugador no encontrado" },
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
        runas_generadas: 0,
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