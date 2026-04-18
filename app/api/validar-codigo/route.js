import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const { codigo } = await req.json();

    if (!codigo) {
      return NextResponse.json(
        { error: "Falta código" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("jugador")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error || !data) {
      return NextResponse.json({
        valid: false
      });
    }

    return NextResponse.json({
      valid: true,
      jugador: data
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}