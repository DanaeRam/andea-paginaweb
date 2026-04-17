"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    // Por ahora acepta cualquier texto
    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen section-purple text-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="glass h-10 w-10 rounded-full grid place-items-center">
              <span className="text-sm font-semibold">A</span>
            </div>
            <span className="font-semibold tracking-wide">ANDEA</span>
          </Link>

          <Link href="/" className="btn-pill btn-glass">
            ← Volver
          </Link>
        </div>

        {/* Contenido */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">

          {/* Info */}
          <div className="card-glass p-8">
            <p className="text-xs uppercase tracking-widest text-white/70">
              Fundación · Administradores
            </p>

            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-mainimage-title">
              Acceso Admin
            </h1>

            <p className="mt-4 text-white/80 leading-relaxed">
              Este portal es para miembros de la fundación. Aquí pueden dar de alta
              estudiantes, generar códigos y revisar actividad.
            </p>
          </div>

          {/* Formulario */}
          <div className="card-glass p-8">
            <h2 className="text-xl font-semibold">Iniciar sesión</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              
              <div>
                <label className="text-sm text-white/80">Email</label>
                <input
                  type="text"
                  placeholder="admin@fundacion.org"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <div>
                <label className="text-sm text-white/80">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <button type="submit" className="btn-pill btn-primary w-full">
                Ingresar
              </button>

            </form>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-16 text-sm text-white/50">
          © {new Date().getFullYear()} ANDEA · Fundación
        </footer>

      </div>
    </main>
  );
}