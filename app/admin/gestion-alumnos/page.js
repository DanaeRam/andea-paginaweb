"use client";

import { useEffect, useState } from "react";

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
  const [copied, setCopied] = useState("");

  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [historialError, setHistorialError] = useState("");

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

      if (activeForm === "historial") {
        fetchHistorial();
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1500);
  }

  async function fetchHistorial() {
    setLoadingHistorial(true);
    setHistorialError("");

    try {
      const response = await fetch("/api/jugador/get");
      const data = await response.json();

      if (!response.ok) {
        setHistorialError(data.error || "No se pudo cargar el historial.");
        return;
      }

      setHistorial(data.jugadores || []);
    } catch (error) {
      setHistorialError("Error al cargar el historial.");
    } finally {
      setLoadingHistorial(false);
    }
  }

  function toggleSection(section) {
    const next = activeForm === section ? null : section;
    setActiveForm(next);

    if (section === "historial" && next === "historial") {
      fetchHistorial();
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
              onClick={() => toggleSection("alta")}
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
                <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                  <div>
                    Código niño: <span className="font-mono">{gameCode}</span>
                  </div>

<button
  onClick={() => copyToClipboard(gameCode)}
  className="ml-2 opacity-70 hover:opacity-100 transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <rect x="9" y="9" width="10" height="10" rx="2" />
    <rect x="5" y="5" width="10" height="10" rx="2" />
  </svg>
</button>
                </div>
              )}

              {copied === "game" && (
                <div className="text-xs text-green-300">
                  Código niño copiado
                </div>
              )}

              {famCode && (
                <div className="flex items-center justify-between text-sm text-white/80">
                  <div>
                    Código familiar: <span className="font-mono">{famCode}</span>
                  </div>

<button
  onClick={() => copyToClipboard(gameCode)}
  className="ml-2 opacity-70 hover:opacity-100 transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <rect x="9" y="9" width="10" height="10" rx="2" />
    <rect x="5" y="5" width="10" height="10" rx="2" />
  </svg>
</button>
                </div>
              )}

              {copied === "fam" && (
                <div className="text-xs text-green-300">
                  Código familiar copiado
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
              onClick={() => toggleSection("baja")}
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

      <div className="card-glass p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Historial</h2>
            <p className="text-sm text-white/70">
              Consulta los jugadores registrados
            </p>
          </div>

          <button
            onClick={() => toggleSection("historial")}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-xl"
          >
            {activeForm === "historial" ? "×" : "+"}
          </button>
        </div>

        {activeForm === "historial" && (
          <div className="mt-6">
            {loadingHistorial && (
              <p className="text-sm text-white/70">Cargando historial...</p>
            )}

            {historialError && (
              <p className="text-sm text-red-300">{historialError}</p>
            )}

            {!loadingHistorial && !historialError && (
              <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/80">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Nombre jugador
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Edad
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Código jugador
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Código familiar
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {historial.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-4 text-center text-white/60"
                        >
                          No hay jugadores registrados.
                        </td>
                      </tr>
                    ) : (
                      historial.map((jugador) => (
                        <tr key={jugador.id}>
                          <td className="px-4 py-3">{jugador.nombre}</td>
                          <td className="px-4 py-3 text-white/75">
                            {jugador.edad}
                          </td>
                          <td className="px-4 py-3 font-mono text-white/75">
                            {jugador.codigo}
                          </td>
                          <td className="px-4 py-3 text-white/50"></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}