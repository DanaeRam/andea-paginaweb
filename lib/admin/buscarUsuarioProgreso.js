export async function buscarUsuarioProgreso({ supabase, codigoJugador }) {
  const startTime = performance.now();

  const { data, error } = await supabase
    .from("jugador")
    .select(`
      id,
      nombre_completo,
      codigo_jugador,
      progreso_lecciones (
        leccion_id,
        completada,
        completada_at,
        lecciones (
          nombre,
          nivel,
          mundo
        )
      )
    `)
    .eq("codigo_jugador", codigoJugador)
    .maybeSingle();

  const endTime = performance.now();
  const loadTimeSeconds = (endTime - startTime) / 1000;

  if (error) {
    return {
      ok: false,
      message: "Error al consultar el usuario.",
      user: null,
      progress: [],
      loadTimeSeconds,
    };
  }

  if (!data) {
    return {
      ok: false,
      message: "Usuario no encontrado.",
      user: null,
      progress: [],
      loadTimeSeconds,
    };
  }

  const progress = data.progreso_lecciones || [];

  const hasCompleteData =
    Boolean(data.id) &&
    Boolean(data.nombre_completo) &&
    Boolean(data.codigo_jugador) &&
    Array.isArray(progress);

  return {
    ok: true,
    message: "Usuario encontrado.",
    user: {
      id: data.id,
      nombreCompleto: data.nombre_completo,
      codigoJugador: data.codigo_jugador,
    },
    progress,
    hasCompleteData,
    loadTimeSeconds,
  };
}