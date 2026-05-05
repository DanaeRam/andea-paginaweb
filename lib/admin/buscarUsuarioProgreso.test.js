import { describe, it, expect, vi } from "vitest";
import { buscarUsuarioProgreso } from "../../lib/admin/buscarUsuarioProgreso";

function crearSupabaseMock({ data = null, error = null, delayMs = 0 }) {
  return {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => {
            if (delayMs > 0) {
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }

            return { data, error };
          }),
        })),
      })),
    })),
  };
}

describe("RF-13 - Consulta de progreso de usuario en portal admin", () => {
  it("TC48_RF13_UsuarioExistente_MuestraProgresoCompletoEnMenosDeTresSegundos", async () => {
    const usuarioMock = {
      id: 1,
      nombre_completo: "Mateo García",
      codigo_jugador: "AND123",
      progreso_lecciones: [
        {
          leccion_id: 1,
          completada: true,
          completada_at: "2026-05-01T10:00:00Z",
          lecciones: {
            nombre: "Sumas básicas",
            nivel: "Básico",
            mundo: "Matemáticas",
          },
        },
        {
          leccion_id: 2,
          completada: true,
          completada_at: "2026-05-01T10:15:00Z",
          lecciones: {
            nombre: "Restas básicas",
            nivel: "Básico",
            mundo: "Matemáticas",
          },
        },
      ],
    };

    const supabase = crearSupabaseMock({
      data: usuarioMock,
      error: null,
      delayMs: 100,
    });

    const result = await buscarUsuarioProgreso({
      supabase,
      codigoJugador: "AND123",
    });

    expect(result.ok).toBe(true);
    expect(result.user.nombreCompleto).toBe("Mateo García");
    expect(result.progress.length).toBe(2);
    expect(result.loadTimeSeconds).toBeLessThan(3);
  });

  it("TC49_RF13_UsuarioInexistente_MuestraMensajeDeError", async () => {
    const supabase = crearSupabaseMock({
      data: null,
      error: null,
    });

    const result = await buscarUsuarioProgreso({
      supabase,
      codigoJugador: "NO_EXISTE",
    });

    expect(result.ok).toBe(false);
    expect(result.user).toBe(null);
    expect(result.progress).toEqual([]);
    expect(result.message).toBe("Usuario no encontrado.");
  });

  it("TC50_RF13_ValidacionDeDatos_DatosCoincidenConBaseDeDatosYEstanCompletos", async () => {
    const usuarioBaseDatosMock = {
      id: 5,
      nombre_completo: "Sofía López",
      codigo_jugador: "AND555",
      progreso_lecciones: [
        {
          leccion_id: 10,
          completada: true,
          completada_at: "2026-05-01T12:00:00Z",
          lecciones: {
            nombre: "Comprensión lectora",
            nivel: "Intermedio",
            mundo: "Lecto-escritura",
          },
        },
      ],
    };

    const supabase = crearSupabaseMock({
      data: usuarioBaseDatosMock,
      error: null,
    });

    const result = await buscarUsuarioProgreso({
      supabase,
      codigoJugador: "AND555",
    });

    expect(result.ok).toBe(true);

    expect(result.user).toEqual({
      id: 5,
      nombreCompleto: "Sofía López",
      codigoJugador: "AND555",
    });

    expect(result.progress).toEqual(usuarioBaseDatosMock.progreso_lecciones);
    expect(result.hasCompleteData).toBe(true);
  });
});