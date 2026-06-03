import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Crear la tabla si no existe
async function initDB() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS registros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      correo VARCHAR(100) NOT NULL,
      mensaje TEXT NOT NULL,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Tabla lista');
}

// Endpoint que llama tu formulario
app.post('/api/registro', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  // Validaciones
  if (!nombre?.trim() || !correo?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ error: 'Correo inválido' });
  }

  await pool.execute(
    'INSERT INTO registros (nombre, correo, mensaje) VALUES (?, ?, ?)',
    [nombre.trim(), correo.trim(), mensaje.trim()]
  );

  res.json({ success: true, message: '¡Registro guardado!' });
});

// Endpoint para obtener todos los registros (Añadido aquí)
app.get('/api/registros', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM registros');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

initDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));