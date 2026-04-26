import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  const { codigo, idRecompensa } = req.body;

  if (!codigo || !idRecompensa) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos' });
  }

  try {
    const { data, error } = await supabase.rpc('comprar_recompensa', {
      p_codigo_jugador: codigo,
      p_recompensa_id: idRecompensa
    });

    if (error) {
      return res.status(400).json({
        ok: false,
        error: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'No se recibió respuesta de la compra'
      });
    }

    return res.status(200).json(data[0]);

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor'
    });
  }
}