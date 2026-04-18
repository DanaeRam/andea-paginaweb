import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function POST(req) {
  try {
    const { nombre, edad, codigo } = await req.json();

    if (!nombre || !edad || !codigo) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("jugador")
      .insert([{ nombre, edad, codigo }])
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