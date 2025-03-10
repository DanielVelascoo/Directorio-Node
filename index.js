const express = require("express");
const db = require("./db"); // Ya es una conexión con Promises
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const obtenerJerarquia = async () => {
  try {
    const [results] = await db.query("SELECT * FROM funcionario ORDER BY Oficina, superior_id IS NULL DESC, superior_id"); // db ya soporta Promises

    let mapa = new Map();
    let raiz = [];

    results.forEach((funcionario) => {
      funcionario.subordinados = [];
      mapa.set(funcionario.numDocumento, funcionario);
    });

    results.forEach((funcionario) => {
      if (funcionario.superior_id) {
        if (mapa.has(funcionario.superior_id)) {
          mapa.get(funcionario.superior_id).subordinados.push(funcionario);
        }
      } else {
        raiz.push(funcionario);
      }
    });

    return raiz;
  } catch (error) {
    console.error("Error al obtener la jerarquía:", error);
    throw error;
  }
};

// Obtener funcionarios de alto mando (superior_id NULL)
app.get("/funcionarios-alto-mando", async (req, res) => {
  try {
      const [rows] = await db.query("SELECT numDocumento, Nombres FROM funcionario WHERE superior_id IS NULL");
      res.json(rows);
  } catch (error) {
      console.error("Error al obtener funcionarios:", error);
      res.status(500).json({ message: "Error en el servidor" });
  }
});

// 📌 Endpoint para registrar un funcionario
app.post("/registrar-funcionario", async (req, res) => {
  const { numDocumento, Nombres, Correo, Celular, Oficina, Funcionalidad, superior_id } = req.body;

  // ✅ Validar que todos los campos sean obligatorios
  if (!numDocumento || !Nombres || !Correo || !Celular || !Oficina || !Funcionalidad || superior_id === undefined) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
      const sql = `
        INSERT INTO funcionario (numDocumento, Nombres, Correo, Celular, Oficina, Funcionalidad, superior_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [numDocumento, Nombres, Correo, Celular, Oficina, Funcionalidad, superior_id];

      await db.query(sql, values);
      
      res.json({ message: "Funcionario registrado con éxito" });
  } catch (error) {
      console.error("Error registrando funcionario:", error);
      res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/api/funcionarios", async (req, res) => {
  try {
    const jerarquia = await obtenerJerarquia();
    res.json(jerarquia);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
