const mysql = require("mysql2/promise");
require("dotenv").config(); // Cargar variables de entorno desde .env

// Configurar la conexión con MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
