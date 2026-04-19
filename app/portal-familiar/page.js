"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PortalFamiliarPage() {
  const router = useRouter();

  function handleRegister(e) {
    e.preventDefault();
    router.push("/portal-familiar/registro-exitoso");
  }

  function handleLogin(e) {
    e.preventDefault();
    router.push("/portal-familiar/acceso-padres");
  }

  return (
    <main className="min-h-screen section-purple text-white">
<header className="relative z-10 mx-auto flex max-w-6xl items-center px-6 py-6">
  {/* Logo */}
  <Link href="/" className="flex items-center gap-2">
    <div className="glass grid h-10 w-10 place-items-center rounded-full">
      <span className="text-sm font-semibold">A</span>
    </div>
    <span className="font-semibold tracking-wide">ANDEA</span>
  </Link>

  <div className="ml-auto flex items-center gap-8">
    <nav className="hidden items-center gap-8 md:flex">
      <Link
        className="text-sm font-semibold text-white/90 hover:text-white"
        href="/"
      >
        Inicio
      </Link>

      <Link
        className="text-sm font-semibold text-white/90 hover:text-white"
        href="/portal-familiar"
      >
        Portal Familiar
      </Link>

      <Link
        className="text-sm font-semibold text-white/90 hover:text-white"
        href="/fundacion"
      >
        Fundación
      </Link>
    </nav>

    <a
      href="https://danaeram.github.io/AndeaWeb3/"
      target="_blank"
      rel="noopener noreferrer"
      className="btn-pill btn-glass"
    >
      Jugar
    </a>
  </div>
</header>

      <div className="mx-auto max-w-6xl px-6 pt-8 pb-16">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-white/70">
            Portal Familiar
          </p>
          <h1 className="text-mainimage-title mt-2 text-3xl font-semibold md:text-4xl">
            Acompaña el progreso de tu hijo en ANDEA
          </h1>
          <p className="mt-4 text-white/80">
            Este espacio ayuda a madres, padres y tutores a entender qué aprende
            el niño, cómo se siente durante el juego y cómo apoyar su avance.
          </p>
        </div>

        <section className="card-glass mt-10 p-6 md:p-8">
          <h2 className="text-xl font-semibold">Sección informativa</h2>

          <div className="mt-6 grid gap-8">
            <div>
              <h3 className="text-lg font-semibold">Objetivo del juego</h3>
              <p className="mt-2 leading-relaxed text-white/75">
                Descripción ...
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="card-glass p-6">
            <h2 className="text-xl font-semibold">Vincula a tu hijo</h2>
            <p className="mt-2 text-white/75">
              La fundación crea el perfil del niño y genera un{" "}
              <span className="font-semibold text-white">Código Familiar</span>{" "}
              (ej. <span className="font-mono">FAM-48K2</span>). Con ese código,
              podrás crear tu cuenta y conectar el progreso del niño.
            </p>

            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-white/80">Email</label>
                <input
                  type="text"
                  placeholder="tutor@email.com"
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

              <div>
                <label className="text-sm text-white/80">
                  Código Familiar
                </label>
                <input
                  type="text"
                  placeholder="FAM-48K2"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <button type="submit" className="btn-pill btn-primary w-full">
                Crear cuenta y vincular
              </button>

              <p className="text-xs text-white/55">
                Por ahora este registro es de prueba: solo da clic en el botón.
              </p>
            </form>
          </div>

          <div className="card-glass p-6">
            <h2 className="text-xl font-semibold">Iniciar sesión para padres</h2>
            <p className="mt-2 text-white/75">
              Si ya vinculaste tu cuenta, inicia sesión para ver el avance,
              misiones completadas y recomendaciones.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-white/80">Email</label>
                <input
                  type="text"
                  placeholder="tutor@email.com"
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
                Iniciar sesión
              </button>

              <p className="text-xs text-white/55">
                Por ahora este registro es de prueba: solo da clic en el botón.
              </p>
            </form>
          </div>
        </section>

      </div>
    </main>
  );
}