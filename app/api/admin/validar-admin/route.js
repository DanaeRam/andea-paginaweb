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
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { valid: false, error: "Falta userId." },
        { status: 400, headers: corsHeaders }
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
        { status: 403, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      valid: true,
      admin: data,
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Error interno del servidor." },
      { status: 500, headers: corsHeaders }
    );
  }
}
