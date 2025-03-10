const db = require('./db');

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('Conexión exitosa, resultado:', rows[0].result);
  } catch (error) {
    console.error('Error en la conexión:', error);
  }
}

testConnection();
