import { supabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

function formatDate(dateString) {
  if (!dateString) return "Sin actividad";

  const date = new Date(dateString);

  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function PadreDashboardPage() {
  const supabaseServer = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabaseServer.auth.getUser();

  if (userError || !user) {
    return (
      <main className="min-h-screen section-purple p-6 text-white">
        <div className="card-glass p-6">
          <h1 className="text-3xl font-semibold text-mainimage-title">
            Dashboard familiar
          </h1>
          <p className="mt-3 text-white/75">
            Debes iniciar sesión para ver el progreso.
          </p>
        </div>
      </main>
    );
  }

  const { data: padre, error: padreError } = await supabaseAdmin
    .from("padre")
    .select("id, email, nombre_completo")
    .eq("id", user.id)
    .maybeSingle();

  if (padreError || !padre) {
    return (
      <main className="min-h-screen section-purple p-6 text-white">
        <div className="card-glass p-6">
          <h1 className="text-3xl font-semibold text-mainimage-title">
            Dashboard familiar
          </h1>
          <p className="mt-3 text-white/75">
            No se encontró una cuenta familiar vinculada.
          </p>
        </div>
      </main>
    );
  }

  const { data: relaciones = [] } = await supabaseAdmin
    .from("padre_jugador")
    .select("jugador_id")
    .eq("padre_id", padre.id);

  const jugadorIds = relaciones.map((r) => r.jugador_id);

  const { data: jugadores = [] } = jugadorIds.length
    ? await supabaseAdmin
        .from("jugador")
        .select("id, nombre_completo, fecha_nacimiento, created_at")
        .in("id", jugadorIds)
    : { data: [] };

  const { data: lecciones = [] } = await supabaseAdmin
    .from("lecciones")
    .select("id, nombre, nivel, mundo, activa");

  const { data: progreso = [] } = jugadorIds.length
    ? await supabaseAdmin
        .from("progreso_lecciones")
        .select("jugador_id, leccion_id, completada, completada_at, created_at")
        .in("jugador_id", jugadorIds)
        .eq("completada", true)
    : { data: [] };

  const leccionesActivas = lecciones.filter((l) => l.activa);
  const totalNinos = jugadores.length;
  const totalLecciones = leccionesActivas.length;

  const progresoUnico = new Map();

  progreso.forEach((p) => {
    const key = `${p.jugador_id}-${p.leccion_id}`;
    progresoUnico.set(key, p);
  });

  const leccionesCompletadas = progresoUnico.size;
  const totalPosibles = totalNinos * totalLecciones;

  const porcentajeCompletado =
    totalPosibles > 0
      ? Math.round((leccionesCompletadas / totalPosibles) * 100)
      : 0;

  const leccionesMap = new Map(lecciones.map((l) => [l.id, l]));

  const progresoPorNino = jugadores.map((j) => {
    const completadas = [...progresoUnico.values()].filter(
      (p) => p.jugador_id === j.id
    );

    const ultimaActividad = completadas
      .map((p) => p.completada_at || p.created_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    return {
      id: j.id,
      nombre: j.nombre_completo,
      completadas: completadas.length,
      porcentaje:
        totalLecciones > 0
          ? Math.round((completadas.length / totalLecciones) * 100)
          : 0,
      ultimaActividad,
    };
  });

  const niveles = ["Basico", "Intermedio", "Avanzado"];

  const progresoPorNivel = niveles.map((nivel) => {
    const leccionesNivel = leccionesActivas.filter((l) => l.nivel === nivel);

    const completadasNivel = [...progresoUnico.values()].filter((p) => {
      const leccion = leccionesMap.get(p.leccion_id);
      return leccion?.nivel === nivel;
    }).length;

    const totalNivel = leccionesNivel.length * totalNinos;

    return {
      nivel,
      porcentaje:
        totalNivel > 0 ? Math.round((completadasNivel / totalNivel) * 100) : 0,
    };
  });

  const kpis = [
    { label: "Niños vinculados", value: totalNinos },
    { label: "Lecciones activas", value: totalLecciones },
    { label: "Lecciones completadas", value: leccionesCompletadas },
    { label: "Avance general", value: `${porcentajeCompletado}%` },
  ];

  return (
    <main className="min-h-screen section-purple text-white">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="card-glass p-6">
          <p className="text-xs uppercase tracking-widest text-white/70">
            Dashboard familiar
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-mainimage-title">
            Resumen de actividad
          </h1>

          <p className="mt-3 text-white/75">
            Bienvenido, {padre.nombre_completo}. Aquí puedes consultar el avance
            de los niños vinculados a tu cuenta.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="card-glass p-6">
              <p className="text-xs uppercase tracking-widest text-white/70">
                {k.label}
              </p>

              <div className="mt-3 text-3xl font-semibold">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Avance por nivel</h2>
              <span className="text-xs text-white/60">Progreso familiar</span>
            </div>

            <div className="mt-6 space-y-5">
              {progresoPorNivel.map((item) => (
                <div key={item.nivel}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{item.nivel}</span>
                    <span className="text-white/70">{item.porcentaje}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.porcentaje}%`,
                        background:
                          "linear-gradient(90deg, rgba(155,108,255,.95), rgba(110,199,255,.95))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Progreso por niño</h2>
              <span className="text-xs text-white/60">Detalle</span>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Lecciones
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Avance
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Última actividad
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {progresoPorNino.map((nino) => (
                    <tr key={nino.id}>
                      <td className="px-4 py-3">{nino.nombre}</td>
                      <td className="px-4 py-3 text-white/75">
                        {nino.completadas}
                      </td>
                      <td className="px-4 py-3 text-white/75">
                        {nino.porcentaje}%
                      </td>
                      <td className="px-4 py-3 text-white/75">
                        {formatDate(nino.ultimaActividad)}
                      </td>
                    </tr>
                  ))}

                  {progresoPorNino.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-6 text-center text-white/60"
                      >
                        No hay niños vinculados a esta cuenta familiar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}