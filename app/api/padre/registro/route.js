import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    const nombreCompleto = body.nombreCompleto?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();
    const codigoFamiliar = body.codigoFamiliar?.trim().toUpperCase();

    if (!nombreCompleto || !email || !password || !codigoFamiliar) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const { data: jugador, error: jugadorError } = await supabaseAdmin
      .from("jugador")
      .select("id, codigo_familiar")
      .eq("codigo_familiar", codigoFamiliar)
      .single();

    if (jugadorError || !jugador) {
      return NextResponse.json(
        { error: "Código familiar inválido" },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "No se pudo crear el usuario" },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    const { error: padreError } = await supabaseAdmin
      .from("padre")
      .insert([
        {
          id: userId,
          email,
          nombre_completo: nombreCompleto,
        },
      ]);

    if (padreError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: padreError.message },
        { status: 500 }
      );
    }

    const { error: relacionError } = await supabaseAdmin
      .from("padre_jugador")
      .insert([
        {
          padre_id: userId,
          jugador_id: jugador.id,
        },
      ]);

    if (relacionError) {
      await supabaseAdmin.from("padre").delete().eq("id", userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: relacionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Cuenta creada y vinculada correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
