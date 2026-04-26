import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { codigo } = await req.json();

    if (!codigo) {
      return NextResponse.json(
        { ok: false, error: 'Falta código del jugador' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('obtener_estado_lecciones', {
      p_codigo_jugador: codigo
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      lecciones: data
    });

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