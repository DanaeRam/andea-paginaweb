"use client";

import { useState } from "react";

function fakeCode(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${prefix}-${part}`;
}

export default function AdminGestionPage() {
  const [activeForm, setActiveForm] = useState(null);

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");

  const [gameCode, setGameCode] = useState("");
  const [famCode, setFamCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCreateStudent() {
    setMessage("");

    if (!nombre.trim() || !edad.trim()) {
      setMessage("Completa nombre y edad.");
      return;
    }

    const nuevoGameCode = fakeCode("GAME");
    const nuevoFamCode = fakeCode("FAM");

    setLoading(true);

    try {
      const response = await fetch("/api/jugador/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          edad: Number(edad),
          codigo: nuevoGameCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "No se pudo guardar el jugador.");
        return;
      }

      setGameCode(nuevoGameCode);
      setFamCode(nuevoFamCode);
      setMessage("Jugador creado correctamente.");

      setNombre("");
      setEdad("");
    } catch (error) {
      setMessage("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-glass p-6">
        <h1 className="text-2xl font-semibold">
          Administración de estudiantes
        </h1>
        <p className="mt-2 text-white/70">
          Gestiona altas y bajas de alumnos
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="card-glass p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Dar de alta</h2>
              <p className="text-sm text-white/70">
                Aquí creas el usuario del niño
              </p>
            </div>

            <button
              onClick={() =>
                setActiveForm(activeForm === "alta" ? null : "alta")
              }
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-xl"
            >
              {activeForm === "alta" ? "×" : "+"}
            </button>
          </div>

          {activeForm === "alta" && (
            <div className="mt-6 space-y-4">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none"
              />

              <input
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Edad"
                type="number"
                className="w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none"
              />

              <button
                onClick={handleCreateStudent}
                disabled={loading}
                className="btn-pill btn-primary w-full"
              >
                {loading ? "Guardando..." : "Generar código"}
              </button>

              {message && (
                <div className="text-sm text-white/80">{message}</div>
              )}

              {gameCode && (
                <div className="mt-3 text-sm text-white/80">
                  Código niño: <span className="font-mono">{gameCode}</span>
                </div>
              )}

              {famCode && (
                <div className="text-sm text-white/80">
                  Código familiar: <span className="font-mono">{famCode}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card-glass p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Dar de baja</h2>
              <p className="text-sm text-white/70">
                Desactiva el acceso de un estudiante
              </p>
            </div>

            <button
              onClick={() =>
                setActiveForm(activeForm === "baja" ? null : "baja")
              }
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-xl"
            >
              {activeForm === "baja" ? "×" : "-"}
            </button>
          </div>

          {activeForm === "baja" && (
            <div className="mt-6 space-y-4">
              <input
                placeholder="Nombre o código"
                className="w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none"
              />

              <button className="btn-pill btn-glass w-full">
                Confirmar baja
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}