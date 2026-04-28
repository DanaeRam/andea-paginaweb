import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { codigo, leccionId, mundo = 'LE' } = await req.json();

    if (!codigo || !leccionId) {
      return NextResponse.json(
        { ok: false, error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const mundoNormalizado = mundo.trim().toUpperCase();

    const { data, error } = await supabase.rpc('marcar_leccion_completada', {
      p_codigo_jugador: codigo,
      p_leccion_id: leccionId,
      p_mundo: mundoNormalizado
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data[0], { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Método no permitido' },
    { status: 405 }
  );
}