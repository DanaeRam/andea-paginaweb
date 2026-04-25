import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  const { codigo, idRecompensa, costo } = req.body;

  if (!codigo || !idRecompensa || !costo) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos' });
  }

  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [jugadorRows] = await connection.execute(
      `SELECT idJugador FROM Jugador WHERE codigoJugador = ?`,
      [codigo]
    );

    if (jugadorRows.length === 0) {
      return res.json({ ok: false, error: 'Jugador no encontrado' });
    }

    const jugadorId = jugadorRows[0].idJugador;

    const [progresoRows] = await connection.execute(
      `SELECT runas, puntosTotales, puntosResiduales 
       FROM Progreso_Jugador 
       WHERE idJugador = ?`,
      [jugadorId]
    );

    if (progresoRows.length === 0) {
      return res.json({ ok: false, error: 'Progreso no encontrado' });
    }

    const runasActuales = progresoRows[0].runas;

    if (runasActuales < costo) {
      return res.json({ ok: false, error: 'No tienes suficientes runas' });
    }

    const [inventarioRows] = await connection.execute(
      `SELECT * FROM Inventario WHERE idJugador = ? AND idRecompensa = ?`,
      [jugadorId, idRecompensa]
    );

    if (inventarioRows.length > 0) {
      return res.json({ ok: false, error: 'Ya tienes esta espada' });
    }

    await connection.beginTransaction();

    await connection.execute(
      `UPDATE Progreso_Jugador 
       SET runas = runas - ? 
       WHERE idJugador = ?`,
      [costo, jugadorId]
    );

    await connection.execute(
      `INSERT INTO Inventario (idJugador, idRecompensa, equipada)
       VALUES (?, ?, FALSE)`,
      [jugadorId, idRecompensa]
    );

    await connection.execute(
      `INSERT INTO Tienda (idJugador, idRecompensa, costoRunas)
       VALUES (?, ?, ?)`,
      [jugadorId, idRecompensa, costo]
    );

    await connection.commit();

    const [nuevoProgreso] = await connection.execute(
      `SELECT runas, puntosTotales, puntosResiduales 
       FROM Progreso_Jugador 
       WHERE idJugador = ?`,
      [jugadorId]
    );

    return res.json({
      ok: true,
      jugador_id: jugadorId,
      puntos_totales: nuevoProgreso[0].puntosTotales,
      runas: nuevoProgreso[0].runas,
      puntos_residuales: nuevoProgreso[0].puntosResiduales
    });

  } catch (error) {
    if (connection) await connection.rollback();

    console.error(error);
    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor'
    });

  } finally {
    if (connection) await connection.end();
  }
}