import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    const { codigo, idRecompensa } = await req.json();

    if (!codigo || !idRecompensa) {
      return NextResponse.json(
        { ok: false, error: 'Datos incompletos' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { data, error } = await supabase.rpc('equipar_recompensa', {
      p_codigo_jugador: codigo,
      p_recompensa_id: idRecompensa
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(data[0], { status: 200, headers: corsHeaders });

  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Método no permitido' },
    { status: 405, headers: corsHeaders }
  );
}
