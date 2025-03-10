const mysql = require("mysql2/promise");

// Configurar la conexión con MySQL
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "directorio",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
