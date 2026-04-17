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

  const [gameCode, setGameCode] = useState("");
  const [famCode, setFamCode] = useState("");

  function handleGenerateCodes() {
    setGameCode(fakeCode("GAME"));
    setFamCode(fakeCode("FAM"));
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
                placeholder="Nombre"
                className="w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none"
              />

              <input
                placeholder="Edad"
                className="w-full rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 outline-none"
              />

              <button
                onClick={handleGenerateCodes}
                className="btn-pill btn-primary w-full"
              >
                Generar código
              </button>

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