import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    const {
      nombre_completo,
      fecha_nacimiento,
      codigo_jugador,
      codigo_familiar,
    } = await req.json();

    if (
      !nombre_completo ||
      !fecha_nacimiento ||
      !codigo_jugador ||
      !codigo_familiar
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
          nombre_completo,
          fecha_nacimiento,
          codigo_jugador,
          codigo_familiar,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

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
    console.error("Route error:", error);

    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
