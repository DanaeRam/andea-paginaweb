import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { valid: false, error: "Falta userId." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("admin")
      .select("id, nombre_completo, email")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { valid: false, error: "No tienes acceso como administrador." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      valid: true,
      admin: data,
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}