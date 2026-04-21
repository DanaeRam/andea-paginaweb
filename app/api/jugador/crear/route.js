import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    const nombreCompleto = body.nombreCompleto?.trim();
    const fechaNacimiento = body.fechaNacimiento?.trim();
    const codigoJugador = body.codigoJugador?.trim();
    const codigoFamiliar = body.codigoFamiliar?.trim();

    if (
      !nombreCompleto ||
      !fechaNacimiento ||
      !codigoJugador ||
      !codigoFamiliar
    ) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("jugador")
      .insert([
        {
          nombre_completo: nombreCompleto,
          fecha_nacimiento: fechaNacimiento,
          codigo_jugador: codigoJugador,
          codigo_familiar: codigoFamiliar,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      jugador: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}