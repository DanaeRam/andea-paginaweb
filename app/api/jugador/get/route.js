import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

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

export async function GET() {
  try {
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
      .order("id", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const jugadores = (data || []).map((jugador) => ({
      ...jugador,
      edad: calculateAge(jugador.fecha_nacimiento),
    }));

    return NextResponse.json({
      ok: true,
      jugadores,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}