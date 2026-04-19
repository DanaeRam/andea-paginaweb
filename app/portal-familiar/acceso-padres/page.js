import Link from "next/link";

const childName = "Mateo García";

const summary = {
  level: 7,
  totalMinutes: 410,
  sections: [
    { key: "mate", name: "Matemáticas", completed: 18, total: 30 },
    { key: "lecto", name: "Lecto-escritura", completed: 22, total: 30 },
    { key: "salud", name: "Salud mental", completed: 10, total: 20 },
  ],
};

const progressBars = [
  { label: "Matemáticas", value: 60 },
  { label: "Lecto-escritura", value: 73 },
  { label: "Salud mental", value: 50 },
];

const weeklyActivity = [
  { day: "Lun", value: 20 },
  { day: "Mar", value: 35 },
  { day: "Mié", value: 25 },
  { day: "Jue", value: 45 },
  { day: "Vie", value: 30 },
  { day: "Sáb", value: 55 },
  { day: "Dom", value: 40 },
];

function pct(completed, total) {
  return Math.round((completed / total) * 100);
}

export default function AccesoPadresPage() {
  const totalPlayed = `${Math.floor(summary.totalMinutes / 60)}h ${
    summary.totalMinutes % 60
  }m`;

  return (
    <main className="min-h-screen section-purple text-white">
      <header className="fixed top-0 left-0 right-0">
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-18 pb-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70">
              Portal de padres
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-mainimage-title">
              Panel de progreso — {childName}
            </h1>
            <p className="mt-3 text-white/80">
              Datos de ejemplo para mostrar cómo se vería el dashboard.
            </p>
          </div>

          <Link href="/portal-familiar" className="btn-pill btn-glass text-center">
            ← Volver al Portal Familiar
          </Link>
        </div>

        {/* Summary cards */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="card-glass p-6">
            <p className="text-xs uppercase tracking-widest text-white/70">
              Nivel general
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-4xl font-semibold">{summary.level}</span>
              <span className="text-white/70 pb-1">/ 10</span>
            </div>
            <p className="mt-3 text-white/75 text-sm">
              Estimación global según lecciones, precisión y constancia.
            </p>
          </div>

          <div className="card-glass p-6">
            <p className="text-xs uppercase tracking-widest text-white/70">
              Tiempo total jugado
            </p>
            <div className="mt-3 text-4xl font-semibold">{totalPlayed}</div>
            <p className="mt-3 text-white/75 text-sm">
              Incluye prácticas y mini-misiones.
            </p>
          </div>

          <div className="card-glass p-6">
            <p className="text-xs uppercase tracking-widest text-white/70">
              Lecciones completadas
            </p>
            <div className="mt-4 space-y-3">
              {summary.sections.map((s) => (
                <div key={s.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/85">{s.name}</span>
                    <span className="text-white/70">
                      {s.completed}/{s.total} ({pct(s.completed, s.total)}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct(s.completed, s.total)}%`,
                        background:
                          "linear-gradient(90deg, rgba(110,199,255,.9), rgba(155,108,255,.9))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Progreso por sección</h2>
              <span className="text-xs text-white/60">Bar chart (ejemplo)</span>
            </div>

            <div className="mt-6 space-y-4">
              {progressBars.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/85">{b.label}</span>
                    <span className="text-white/70">{b.value}%</span>
                  </div>
                  <div className="mt-2 h-3 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${b.value}%`,
                        background:
                          "linear-gradient(90deg, rgba(110,199,255,.95), rgba(155,108,255,.95))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Actividad por semana</h2>
              <span className="text-xs text-white/60">Line chart (ejemplo)</span>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-3 h-40">
                {weeklyActivity.map((p) => (
                  <div key={p.day} className="flex flex-col items-center gap-2 w-full">
                    <div className="relative w-full flex items-end justify-center">
                      <div
                        className="w-2 rounded-full"
                        style={{
                          height: `${p.value * 2}px`,
                          background:
                            "linear-gradient(180deg, rgba(155,108,255,.95), rgba(110,199,255,.95))",
                        }}
                      />
                      <div className="absolute -top-2 h-3 w-3 rounded-full bg-white/80" />
                    </div>
                    <div className="text-xs text-white/70">{p.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}