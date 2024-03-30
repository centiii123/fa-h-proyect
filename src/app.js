import express from 'express'
import { pool } from './db.js'
import {PORT} from './config.js'

const app = express()
app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World sebas!');
})

app.get('/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result[0]);
});

// Obtener un usuario por ID
app.get('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (result.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear un usuario
app.post('/users', async (req, res) => {
  const {email,password} = req.body;
  try {
    const result = await pool.query('INSERT INTO users(email, passwo) VALUES (?, ?)', [email, password]);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Actualizar un usuario por ID
app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const { email, password } = req.body;
  try {
    const result = await pool.query('UPDATE users SET email = ?, passwo = ? WHERE id = ?', [email, password, id]);
    if (result.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Eliminar un usuario por ID
app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario eliminado correctamente' });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.listen(PORT)
console.log('Server on port', PORT)
