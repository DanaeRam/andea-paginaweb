import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

function calculateAge(fechaNacimiento) {
  if (!fechaNacimiento) return null;

  const today = new Date();
  const birthDate = new Date(`${fechaNacimiento}T00:00:00`);

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
        { status: 400 }
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
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      jugador: {
        id: data.id,
        nombreCompleto: data.nombre_completo,
        fechaNacimiento: data.fecha_nacimiento,
        codigoJugador: data.codigo_jugador,
        codigoFamiliar: data.codigo_familiar,
        createdAt: data.created_at,
        edad: calculateAge(data.fecha_nacimiento),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}