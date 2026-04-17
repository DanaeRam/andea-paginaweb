import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <main className="min-h-screen section-purple text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-start gap-6">

          {/* Sidebar */}
          <aside className="hidden md:block w-72 card-glass p-5 sticky top-6 h-[calc(100vh-3rem)] overflow-auto">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="glass h-10 w-10 rounded-full grid place-items-center">
                <span className="text-sm font-semibold">A</span>
              </div>
              <div>
                <div className="font-semibold leading-tight">ANDEA</div>
                <div className="text-xs text-white/60">Admin Fundación</div>
              </div>
            </div>

            {/* Menú */}
            <div className="mt-6 space-y-2">
              <Link
                className="block rounded-xl px-3 py-2 bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                href="/admin/dashboard"
              >
                Dashboard general
              </Link>

              <Link
                className="block rounded-xl px-3 py-2 bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                href="/admin/gestion"
              >
                Gestión
              </Link>
            </div>

            <div className="mt-6 h-px w-full bg-white/10" />

            {/* Links secundarios */}
            <div className="mt-4 space-y-2 text-sm text-white/75">
              <Link className="block hover:text-white" href="/">
                ← Ir a Inicio
              </Link>

              <Link className="block hover:text-white" href="/admin">
                Cerrar sesión (demo)
              </Link>
            </div>

            <p className="mt-6 text-xs text-white/55">
              Datos de ejemplo (demo).
            </p>
          </aside>

          {/* Contenido */}
          <section className="flex-1">

            {/* Top bar móvil */}
            <div className="md:hidden card-glass p-4 mb-4 flex items-center justify-between">
              <Link href="/admin/dashboard" className="font-semibold">
                Admin
              </Link>

              <div className="flex gap-2">
                <Link href="/admin/gestion" className="btn-pill btn-glass">
                  Gestión
                </Link>

                <Link href="/admin/bd" className="btn-pill btn-glass">
                  BD
                </Link>
              </div>
            </div>

            {children}

            <footer className="mt-10 text-sm text-white/50">
              © {new Date().getFullYear()} ANDEA · Admin Fundación
            </footer>
          </section>

        </div>
      </div>
    </main>
  );
}