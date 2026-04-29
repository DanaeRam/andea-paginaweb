import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

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
        { status: 400, headers: corsHeaders }
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
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      ok: true,
      jugador: data,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Route error:", error);

    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}
