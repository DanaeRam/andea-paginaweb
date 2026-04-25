"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PortalFamiliarPage() {
  const router = useRouter();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [emailRegistro, setEmailRegistro] = useState("");
  const [passwordRegistro, setPasswordRegistro] = useState("");
  const [codigoFamiliar, setCodigoFamiliar] = useState("");

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [registerMessage, setRegisterMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleRegister(e) {
    e.preventDefault();
    setRegisterMessage("");

    const nombreLimpio = nombreCompleto.trim();
    const emailLimpio = emailRegistro.trim().toLowerCase();
    const passwordLimpio = passwordRegistro.trim();
    const codigoLimpio = codigoFamiliar.trim().toUpperCase();

    if (!nombreLimpio || !emailLimpio || !passwordLimpio || !codigoLimpio) {
      setRegisterMessage("Completa todos los campos.");
      return;
    }

    if (!isValidEmail(emailLimpio)) {
      setRegisterMessage("Ingresa un correo válido.");
      return;
    }

    if (passwordLimpio.length < 6) {
      setRegisterMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!codigoLimpio.startsWith("FAM-")) {
      setRegisterMessage("El código familiar debe iniciar con FAM-.");
      return;
    }

    setLoadingRegister(true);

    try {
      const response = await fetch("/api/padre/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreCompleto: nombreLimpio,
          email: emailLimpio,
          password: passwordLimpio,
          codigoFamiliar: codigoLimpio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegisterMessage(data.error || "No se pudo crear la cuenta.");
        return;
      }

      setNombreCompleto("");
      setEmailRegistro("");
      setPasswordRegistro("");
      setCodigoFamiliar("");

      router.push("/portal-familiar/registro-exitoso");
    } catch (error) {
      setRegisterMessage("Error de conexión con el servidor.");
    } finally {
      setLoadingRegister(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginMessage("");

    const emailLimpio = emailLogin.trim().toLowerCase();
    const passwordLimpio = passwordLogin.trim();

    if (!emailLimpio || !passwordLimpio) {
      setLoginMessage("Completa correo y contraseña.");
      return;
    }

    if (!isValidEmail(emailLimpio)) {
      setLoginMessage("Ingresa un correo válido.");
      return;
    }

    setLoadingLogin(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailLimpio,
        password: passwordLimpio,
      });

      if (error) {
        setLoginMessage("Correo o contraseña incorrectos.");
        return;
      }

      router.push("/portal-familiar/acceso-padres");
    } catch (error) {
      setLoginMessage("Error al iniciar sesión.");
    } finally {
      setLoadingLogin(false);
    }
  }

  return (
    <main className="min-h-screen section-purple text-white">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center px-6 py-6">
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
                <label className="text-sm text-white/80">
                  Nombre completo del padre o tutor
                </label>
                <input
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  placeholder="Nombre completo"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <div>
                <label className="text-sm text-white/80">Email</label>
                <input
                  type="email"
                  value={emailRegistro}
                  onChange={(e) => setEmailRegistro(e.target.value)}
                  placeholder="tutor@email.com"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <div>
                <label className="text-sm text-white/80">Contraseña</label>
                <input
                  type="password"
                  value={passwordRegistro}
                  onChange={(e) => setPasswordRegistro(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <div>
                <label className="text-sm text-white/80">Código Familiar</label>
                <input
                  type="text"
                  value={codigoFamiliar}
                  onChange={(e) => setCodigoFamiliar(e.target.value.toUpperCase())}
                  placeholder="FAM-48K2"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <button
                type="submit"
                disabled={loadingRegister}
                className="btn-pill btn-primary w-full"
              >
                {loadingRegister ? "Creando cuenta..." : "Crear cuenta y vincular"}
              </button>

              {registerMessage && (
                <p className="text-sm text-white/80">{registerMessage}</p>
              )}
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
                  type="email"
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  placeholder="tutor@email.com"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <div>
                <label className="text-sm text-white/80">Contraseña</label>
                <input
                  type="password"
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <button
                type="submit"
                disabled={loadingLogin}
                className="btn-pill btn-primary w-full"
              >
                {loadingLogin ? "Ingresando..." : "Iniciar sesión"}
              </button>

              {loginMessage && (
                <p className="text-sm text-white/80">{loginMessage}</p>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}