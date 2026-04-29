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

function calculateAge(fecha_nacimiento) {
  if (!fecha_nacimiento) return null;

  const today = new Date();
  const birthDate = new Date(`${fecha_nacimiento}T00:00:00`);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export async function POST(req) {
  try {
    const { codigo } = await req.json();

    if (!codigo) {
      return NextResponse.json(
        { error: "Falta código" },
        { status: 400, headers: corsHeaders }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("jugador")
      .select(`
        id,
        nombre_completo,
        fecha_nacimiento,
        codigo_jugador,
        codigo_familiar,
        created_at
      `)
      .eq("codigo_jugador", codigo)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { valid: false },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        jugador: {
          ...data,
          edad: calculateAge(data.fecha_nacimiento),
        },
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500, headers: corsHeaders }
    );
  }
}