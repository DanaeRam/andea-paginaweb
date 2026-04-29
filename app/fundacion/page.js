"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FundacionLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const emailLimpio = email.trim().toLowerCase();
    const passwordLimpio = password.trim();

    if (!emailLimpio || !passwordLimpio) {
      setMessage("Completa correo y contraseña.");
      return;
    }

    if (!isValidEmail(emailLimpio)) {
      setMessage("Ingresa un correo válido.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLimpio,
        password: passwordLimpio,
      });

      if (error || !data.user) {
        setMessage("Correo o contraseña incorrectos.");
        return;
      }

      const response = await fetch("/api/admin/validar-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: data.user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.valid) {
        await supabase.auth.signOut();
        setMessage(result.error || "No tienes acceso como administrador.");
        return;
      }

      localStorage.setItem("adminEmail", result.admin.email);
      localStorage.setItem("adminName", result.admin.nombre_completo);

      router.replace("/admin/dashboard");
    } catch (error) {
      setMessage("Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen section-purple text-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="glass grid h-10 w-10 place-items-center rounded-full">
              <span className="text-sm font-semibold">A</span>
            </div>
            <span className="font-semibold tracking-wide">ANDEA</span>
          </Link>

          <Link href="/" className="btn-pill btn-glass">
            ← Volver
          </Link>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="card-glass p-8">
            <p className="text-xs uppercase tracking-widest text-white/70">
              Fundación · Administrador
            </p>

            <h1 className="text-mainimage-title mt-2 text-3xl font-semibold md:text-4xl">
              Acceso Admin
            </h1>

            <p className="mt-4 leading-relaxed text-white/80">
              Portal exclusivo para la administración de ANDEA. Aquí se gestionan
              estudiantes, padres, códigos y reportes.
            </p>

            <div className="mt-6 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-sm text-white/75">
                Solo el administrador autorizado puede ingresar.
              </p>
            </div>
          </div>

          <div className="card-glass p-8">
            <h2 className="text-xl font-semibold">Iniciar sesión</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-white/80">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fundacion.org"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <div>
                <label className="text-sm text-white/80">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none focus:ring-white/25"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-pill btn-primary w-full"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>

              {message && <p className="text-sm text-white/80">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}