import Image from "next/image";
import Link from "next/link";

const problems = [
  {
    title: "Lecto-escritura",
    desc: "Ejercicios simples y visuales para aprender a leer y escribir.",
  },
  {
    title: "Matemáticas",
    desc: "Actividades básicas para practicar números de forma divertida.",
  },
  {
    title: "Salud Mental",
    desc: "Ejercicios para reconocer emociones y fortalecer confianza.",
  },
];

export default function Home() {
  return (
    <main>

      <section style={{ position: "relative", height: "100vh" }}>
        <Image
          src="/andea-inicio.png"
          alt="Fondo ANDEA"
          fill
          style={{ objectFit: "cover" }}
        />

        <header style={{ position: "relative", padding: "20px", display: "flex", justifyContent: "space-between" }}>
          <Link href="/">ANDEA</Link>

          <nav>
            <Link href="/">Inicio </Link>
            <Link href="/portal-familiar">Portal </Link>
            <Link href="/fundacion">Fundación </Link>
            <Link href="/jugar">Jugar</Link>
          </nav>
        </header>

        <div style={{ position: "relative", padding: "40px" }}>
          <h1>ANDEA</h1>
          <p>
            Aprende lecto-escritura, matemáticas y salud mental jugando.
          </p>

          <Link href="/jugar">Jugar</Link>
        </div>
      </section>

      <section style={{ padding: "40px" }}>
        <h2>¿Qué problema resolvemos?</h2>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {problems.map((p) => (
            <div key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "40px" }}>
        <h3>Portal Familiar</h3>
        <p>Ver progreso y actividades del usuario.</p>

        <h3>Fundación</h3>
        <p>Gestión de estudiantes y reportes.</p>
      </section>

    </main>
  );
}