import { supabaseAdmin } from "@/lib/supabase";

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

export default async function AdminDashboardPage() {
  const { data: jugadores = [] } = await supabaseAdmin
    .from("jugador")
    .select("id, nombre_completo, created_at");

  const { data: lecciones = [] } = await supabaseAdmin
    .from("lecciones")
    .select("id, nombre, nivel, mundo, activa");

  const { data: progreso = [] } = await supabaseAdmin
    .from("progreso_lecciones")
    .select("jugador_id, leccion_id, completada, completada_at, created_at")
    .eq("completada", true);

  const totalJugadores = jugadores.length;
  const totalLecciones = lecciones.filter((l) => l.activa).length;

  const progresoUnico = new Map();

  progreso.forEach((p) => {
    const key = `${p.jugador_id}-${p.leccion_id}`;
    progresoUnico.set(key, p);
  });

  const leccionesCompletadas = progresoUnico.size;

  const totalPosibles = totalJugadores * totalLecciones;

  const porcentajeCompletado =
    totalPosibles > 0
      ? Math.round((leccionesCompletadas / totalPosibles) * 100)
      : 0;

  const promedioLecciones =
    totalJugadores > 0
      ? (leccionesCompletadas / totalJugadores).toFixed(1)
      : 0;

  const leccionesMap = new Map(lecciones.map((l) => [l.id, l]));

  const mundoCount = {};

  progresoUnico.forEach((p) => {
    const leccion = leccionesMap.get(p.leccion_id);
    const mundo = leccion?.mundo || "Sin mundo";

    mundoCount[mundo] = (mundoCount[mundo] || 0) + 1;
  });

  const mundoMasJugado =
    Object.entries(mundoCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Sin datos";

  const progresoPorJugador = jugadores.map((j) => {
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

  const bajaActividad = progresoPorJugador
    .sort((a, b) => a.completadas - b.completadas)
    .slice(0, 5);

  const niveles = ["Basico", "Intermedio", "Avanzado"];

  const progresoPorNivel = niveles.map((nivel) => {
    const leccionesNivel = lecciones.filter((l) => l.nivel === nivel);

    const completadasNivel = [...progresoUnico.values()].filter((p) => {
      const leccion = leccionesMap.get(p.leccion_id);
      return leccion?.nivel === nivel;
    }).length;

    const totalNivel = leccionesNivel.length * totalJugadores;

    return {
      nivel,
      porcentaje:
        totalNivel > 0 ? Math.round((completadasNivel / totalNivel) * 100) : 0,
    };
  });

  const kpis = [
    { label: "Niños registrados", value: totalJugadores },
    { label: "Lecciones activas", value: totalLecciones },
    { label: "% lecciones completadas", value: `${porcentajeCompletado}%` },
    { label: "Promedio por niño", value: `${promedioLecciones} lecciones` },
    { label: "Sección más jugada", value: mundoMasJugado },
  ];

  return (
    <div className="space-y-6">
      <div className="card-glass p-6">
        <p className="text-xs uppercase tracking-widest text-white/70">
          Dashboard general
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-mainimage-title">
          Resumen de actividad
        </h1>

        <p className="mt-3 text-white/75">
          Indicadores calculados con datos reales de jugadores, lecciones y
          progreso de lecciones.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
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
            <span className="text-xs text-white/60">Promedio general</span>
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
            <h2 className="text-xl font-semibold">Niños con menor avance</h2>
            <span className="text-xs text-white/60">Seguimiento</span>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Lecciones
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Avance</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Última actividad
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {bajaActividad.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3">{r.nombre}</td>
                    <td className="px-4 py-3 text-white/75">
                      {r.completadas}
                    </td>
                    <td className="px-4 py-3 text-white/75">
                      {r.porcentaje}%
                    </td>
                    <td className="px-4 py-3 text-white/75">
                      {formatDate(r.ultimaActividad)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}