import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase"; 

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jugadorId = searchParams.get("jugadorId");

    if (!jugadorId) {
      return NextResponse.json(
        { error: "Falta el parámetro jugadorId" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("progreso_jugador")
      .select("jugador_id, puntos_totales, runas, puntos_residuales") 
      .eq("jugador_id", jugadorId) 
      .single(); 

    if (error || !data) {
      return NextResponse.json(
        { error: "Jugador no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      progreso: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}