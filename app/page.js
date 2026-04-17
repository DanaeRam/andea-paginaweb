import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Image
        src="/andea-inicio.png"
        alt="Fondo principal de ANDEA"
        fill
        priority
        className="object-cover"
      />

      <div className="mainimage-overlay absolute inset-0 z-10" />

      <section className="relative z-20 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 md:px-10">
          <div className="flex items-center gap-3">
            <div className="glass flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold">
              A
            </div>
            <span className="text-lg font-bold tracking-wide">ANDEA</span>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            <Link href="/" className="font-semibold text-white/95 transition hover:text-white">
              Inicio
            </Link>
            <Link
              href="/portal-familiar"
              className="font-semibold text-white/95 transition hover:text-white"
            >
              Portal Familiar
            </Link>
            <Link
              href="/fundacion"
              className="font-semibold text-white/95 transition hover:text-white"
            >
              Fundación
            </Link>
          </nav>

          <Link href="/jugar" className="btn-pill btn-glass">
            Jugar
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-16 pt-6 md:px-10">
          <div className="max-w-xl">
            <h1 className="text-mainimage-title text-6xl font-extrabold tracking-tight md:text-7xl">
              ANDEA
            </h1>

            <div className="mainimage-divider my-8" />

            <p className="text-mainimage-paragraph text-lg font-medium md:text-xl">
              Imagina un mundo donde aprender es tan emocionante como pasar de nivel
              en tu juego favorito. <strong>ANDEA</strong> convierte la lecto-escritura,
              las matemáticas básicas y el cuidado de la salud mental en retos con
              aventuras, mini-misiones y recompensas.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link href="/jugar" className="btn-pill btn-primary">
                Jugar
              </Link>

              <a
                href="#problematica"
                className="text-base font-semibold text-white/85 transition hover:text-white"
              >
                Ver cómo ayuda ↓
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none pb-6 text-center text-sm font-medium text-white/70">
          Desliza para ver más
        </div>
      </section>
    </main>
  );
}