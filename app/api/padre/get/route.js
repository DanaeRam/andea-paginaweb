import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("padre_jugador")
      .select(`
        id,
        padre:padre_id (
          id,
          nombre_completo,
          email
        ),
        jugador:jugador_id (
          id,
          nombre_completo,
          codigo_familiar
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const padres = (data || []).map((item) => ({
      id: item.id,
      nombreCompleto: item.padre?.nombre_completo || "",
      email: item.padre?.email || "",
      codigoFamiliar: item.jugador?.codigo_familiar || "",
      nombreNino: item.jugador?.nombre_completo || "",
    }));

    return NextResponse.json({
      ok: true,
      padres,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
