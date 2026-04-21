"use client";

import { useEffect, useState } from "react";

export default function GestionPadresPage() {
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const [historialError, setHistorialError] = useState("");

  async function fetchHistorialPadres() {
    setLoadingHistorial(true);
    setHistorialError("");

    try {
      const response = await fetch("/api/padre/get");
      const data = await response.json();

      if (!response.ok) {
        setHistorialError(data.error || "No se pudo cargar el historial de padres.");
        return;
      }

      setHistorial(data.padres || []);
    } catch (error) {
      setHistorialError("Error al cargar el historial de padres.");
    } finally {
      setLoadingHistorial(false);
    }
  }

  useEffect(() => {
    fetchHistorialPadres();
  }, []);

  return (
    <div className="space-y-6">
      <div className="card-glass p-6">
        <h1 className="text-2xl font-semibold">Gestión de padres</h1>
        <p className="mt-2 text-white/70">
          Gestiona el registro de padres y vinculación con niños.
        </p>
      </div>

      <div className="card-glass p-5">
        <div>
          <h2 className="text-lg font-semibold">Historial de padres</h2>
          <p className="text-sm text-white/70">
            Consulta los padres registrados y el niño con el que están vinculados.
          </p>
        </div>

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
                      Nombre completo del padre
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Correo
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Código familiar
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Nombre del niño vinculado
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
                        No hay padres registrados.
                      </td>
                    </tr>
                  ) : (
                    historial.map((padre) => (
                      <tr key={padre.id}>
                        <td className="px-4 py-3">{padre.nombreCompleto}</td>
                        <td className="px-4 py-3 text-white/75">{padre.email}</td>
                        <td className="px-4 py-3 font-mono text-white/75">
                          {padre.codigoFamiliar}
                        </td>
                        <td className="px-4 py-3 text-white/75">
                          {padre.nombreNino}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}