import Image from "next/image";
import Link from "next/link";

const problems = [
  {
    title: "Lecto-escritura",
    desc: "Aprender a leer y escribir de forma divertida.",
  },
  {
    title: "Matemáticas",
    desc: "Practicar números con juegos.",
  },
  {
    title: "Salud Mental",
    desc: "Reconocer emociones y fortalecer confianza.",
  },
];

export default function Home() {
  return (
    <main>

      <section className="mainimage">
        <Image
          src="/andea-inicio.png"
          alt="Fondo"
          fill
          style={{ objectFit: "cover" }}
        />

        <header className="navbar">
          <Link href="/">ANDEA</Link>

          <nav>
            <Link href="/">Inicio</Link>
            <Link href="/portal-familiar">Portal</Link>
            <Link href="/fundacion">Fundación</Link>
            <Link href="/jugar">Jugar</Link>
          </nav>
        </header>

        <div className="mainimage-content">
          <h1>ANDEA</h1>
          <p>Aprende jugando</p>

          <Link href="/jugar">Jugar</Link>
        </div>
      </section>

      <section className="section">
        <h2>¿Qué problema resolvemos?</h2>

        <div className="problems">
          {problems.map((p) => (
            <div key={p.title} className="card">
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3>Portal Familiar</h3>
        <p>Seguimiento del progreso del usuario.</p>

        <h3>Fundación</h3>
        <p>Gestión de estudiantes.</p>
      </section>

    </main>
  );
}