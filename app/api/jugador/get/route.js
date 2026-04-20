import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("jugador")
      .select(`
        id,
        nombreCompleto,
        fechaNacimiento,
        codigoJugador,
        codigoFamiliar,
        createdAt,
        edad:EXTRACT(YEAR FROM AGE(current_date, fechaNacimiento))
      `)
      .order("id", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      jugadores: data,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}