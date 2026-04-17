import Image from "next/image";
import Link from "next/link";

const problems = [
  {
    title: "Lecto-escritura",
    desc: "Practica lecto-escritura con ejercicios cortos, guiados y visuales.",
  },
  {
    title: "Matemáticas",
    desc: "Practica matemáticas con ejercicios cortos, guiados y visuales.",
  },
  {
    title: "Salud Mental",
    desc: "Incluye actividades simples para reconocer emociones, fortalecer confianza y bienestar.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/andea-inicio.png"
          alt="Fondo del videojuego ANDEA"
          fill
          priority
          className="object-cover"
        />

        <div className="mainimage-overlay absolute inset-0" />

        <header className="relative z-10 mx-auto flex max-w-6xl items-center px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="glass grid h-10 w-10 place-items-center rounded-full">
              <span className="text-sm font-semibold">A</span>
            </div>
            <span className="font-semibold tracking-wide">ANDEA</span>
          </Link>

          <div className="ml-auto flex items-center gap-8">
            <nav className="hidden items-center gap-8 md:flex">
              <Link className="text-sm font-semibold text-white/90 hover:text-white" href="#inicio">
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

        <div
          id="inicio"
          className="relative z-10 mx-auto flex max-w-6xl px-6 pb-20 pt-16 md:pt-24"
        >
          <div className="max-w-xl">
            <h1 className="text-mainimage-title text-4xl font-semibold leading-tight md:text-6xl">
              ANDEA
            </h1>

            <div className="mainimage-divider mt-5" />

            <p className="text-mainimage-paragraph mt-5 leading-relaxed">
              Imagina un mundo donde aprender es tan emocionante como pasar de nivel en
              tu juego favorito.
              <span className="font-semibold text-white"> ANDEA </span>
              convierte la lecto-escritura, las matemáticas básicas y el cuidado de la
              salud mental en retos con aventuras, mini-misiones y recompensas.
            </p>

            <div className="mt-7 flex items-center gap-4">
              <a
                href="https://danaeram.github.io/AndeaWeb3/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-primary"
              >
                Jugar
              </a>

              <a href="#problematica" className="text-sm text-white/85 hover:text-white">
                Ver cómo ayuda ↓
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs text-white/70">
          Desliza para ver más
        </div>
      </section>

      <section id="problematica" className="section-purple px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-white/70">
              ¿Qué problema resuelve?
            </p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
              3 problemáticas que atacamos con el videojuego
            </h2>
            <p className="mt-4 text-white/80">
              ANDEA está pensado para niños y familias: simple, visual y con retos
              cortos para mantener atención, motivación y aprendizaje constante.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {problems.map((p) => (
              <div key={p.title} className="card-glass p-6">
                <div className="glass mb-3 h-10 w-10 rounded-xl" />
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <div id="portal" className="card-glass p-6">
              <h3 className="text-xl font-semibold">Portal Familiar</h3>
              <p className="mt-2 text-white/75">
                Un espacio para que la familia vea avances, misiones completadas y
                recomendaciones de práctica.
              </p>
            </div>

            <div id="fundacion" className="card-glass p-6">
              <h3 className="text-xl font-semibold">Fundación</h3>
              <p className="mt-2 text-white/75">
                Portal exclusivo para miembros de la fundación. Aquí se gestionan
                estudiantes, códigos y reportes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}