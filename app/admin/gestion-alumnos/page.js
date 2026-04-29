"use client";

import { useState } from "react";

function fakeCode(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${prefix}-${part}`;
}

function calculateAge(fecha_nacimiento) {
  if (!fecha_nacimiento) return "";

  const today = new Date();
  const birthDate = new Date(`${fecha_nacimiento}T00:00:00`);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function formatDateForDB(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  return date.toISOString().split("T")[0]; 
}

function formatDisplayDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminGestionPage() {
  const [activeForm, setActiveForm] = useState(null);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

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

    if (!nombreCompleto.trim()) {
      setMessage("Completa el nombre completo.");
      return;
    }

    if (!fechaNacimiento) {
      setMessage("Completa la fecha de nacimiento.");
      return;
    }

    const edadCalculada = calculateAge(fechaNacimiento);

    if (edadCalculada < 0 || edadCalculada > 110) {
      setMessage("La fecha de nacimiento no es válida.");
      return;
    }

    const nuevoGameCode = fakeCode("JUG");
    const nuevoFamCode = fakeCode("FAM");

    setLoading(true);

    try {
      const response = await fetch("/api/jugador/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_completo: nombreCompleto.trim(),
          fecha_nacimiento: formatDateForDB(fechaNacimiento),
          codigo_jugador: nuevoGameCode,
          codigo_familiar: nuevoFamCode,
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

      setNombreCompleto("");
      setFechaNacimiento("");

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
        <h1 className="text-2xl font-semibold">Gestión de alumnos</h1>
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
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Nombre completo"
                className="w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none"
              />

              <div className="space-y-3">
                <label className="block text-sm text-white/80">
                  Fecha de nacimiento
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateStudent}
                disabled={loading}
                className="btn-pill btn-primary w-full"
              >
                {loading ? "Guardando..." : "Generar códigos"}
              </button>

              {message && (
                <div className="text-sm text-white/80">{message}</div>
              )}

              {gameCode && (
                <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                  <div>
                    Código jugador: <span className="font-mono">{gameCode}</span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(gameCode, "game")}
                    className="ml-2 opacity-70 transition hover:opacity-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <rect x="9" y="9" width="10" height="10" rx="2" />
                      <rect x="5" y="5" width="10" height="10" rx="2" />
                    </svg>
                  </button>
                </div>
              )}

              {copied === "game" && (
                <div className="text-xs text-green-300">
                  Código de jugador copiado
                </div>
              )}

              {famCode && (
                <div className="flex items-center justify-between text-sm text-white/80">
                  <div>
                    Código familiar: <span className="font-mono">{famCode}</span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(famCode, "fam")}
                    className="ml-2 opacity-70 transition hover:opacity-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
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
              <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/80">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Nombre completo
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
                      <th className="px-4 py-3 text-left font-semibold">
                        Fecha de creación
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {historial.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-4 text-center text-white/60"
                        >
                          No hay jugadores registrados.
                        </td>
                      </tr>
                    ) : (
                      historial.map((jugador) => (
                        <tr key={jugador.id}>
                          <td className="px-4 py-3">
                            {jugador.nombre_completo}
                          </td>
                          <td className="px-4 py-3 text-white/75">
                            {calculateAge(jugador.fecha_nacimiento)}
                          </td>
                          <td className="px-4 py-3 font-mono text-white/75">
                            {jugador.codigo_jugador}
                          </td>
                          <td className="px-4 py-3 font-mono text-white/75">
                            {jugador.codigo_familiar}
                          </td>
                          <td className="px-4 py-3 text-white/75">
                            {formatDisplayDate(jugador.created_at)}
                          </td>
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