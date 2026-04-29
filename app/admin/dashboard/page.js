const kpis = [
  { label: "Niños activos", value: "48" },
  { label: "Tiempo promedio", value: "22 min/día" },
  { label: "% lecciones completadas", value: "63%" },
  { label: "Sección más jugada", value: "Lecto-escritura" },
];

const weekly = [
  { day: "Lun", val: 34 },
  { day: "Mar", val: 42 },
  { day: "Mié", val: 28 },
  { day: "Jue", val: 50 },
  { day: "Vie", val: 39 },
  { day: "Sáb", val: 57 },
  { day: "Dom", val: 44 },
];

const lowActivity = [
  { name: "Ana L.", lastSeen: "Hace 12 días", total: "45 min" },
  { name: "Diego R.", lastSeen: "Hace 9 días", total: "30 min" },
  { name: "Sofía M.", lastSeen: "Hace 15 días", total: "25 min" },
  { name: "Luis P.", lastSeen: "Hace 11 días", total: "40 min" },
];

export default function AdminDashboardPage() {
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
          Indicadores para monitorear uso, avance y alertas de seguimiento (demo).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-glass p-6">
            <p className="text-xs uppercase tracking-widest text-white/70">
              {k.label}
            </p>

            <div className="mt-3 text-3xl font-semibold">
              {k.value}
            </div>

            <div className="mt-2 text-sm text-white/60">
              Datos de ejemplo.
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="card-glass p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Actividad semanal</h2>
            <span className="text-xs text-white/60">Sesiones por día</span>
          </div>

          <div className="mt-6 flex items-end justify-between gap-3 h-44">
            {weekly.map((p) => (
              <div key={p.day} className="flex flex-col items-center gap-2 w-full">
                <div className="relative w-full flex items-end justify-center">
                  <div
                    className="w-3 rounded-full"
                    style={{
                      height: `${p.val * 2}px`,
                      background:
                        "linear-gradient(180deg, rgba(155,108,255,.95), rgba(110,199,255,.95))",
                      boxShadow: "0 12px 35px rgba(0,0,0,.25)",
                    }}
                  />
                </div>
                <div className="text-xs text-white/70">{p.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Niños con baja actividad
            </h2>
            <span className="text-xs text-white/60">Alerta</span>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold">Última vez</th>
                  <th className="px-4 py-3 text-left font-semibold">Tiempo total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {lowActivity.map((r) => (
                  <tr key={r.name}>
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3 text-white/75">{r.lastSeen}</td>
                    <td className="px-4 py-3 text-white/75">{r.total}</td>
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