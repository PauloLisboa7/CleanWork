const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Teste de conexão com o banco
pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL');
});

// Rotas
app.get('/api/obras', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obras');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar obras' });
  }
});

app.get('/api/demandas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM demandas ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar demandas' });
  }
});

app.post('/api/demandas', async (req, res) => {
  const { titulo, descricao, bairro, latitude, longitude, usuario_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO demandas (titulo, descricao, bairro, latitude, longitude, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, descricao, bairro, latitude, longitude, usuario_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar demanda' });
  }
});

app.put('/api/demandas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, bairro, latitude, longitude, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE demandas SET titulo = $1, descricao = $2, bairro = $3, latitude = $4, longitude = $5, status = $6 WHERE id = $7 RETURNING *',
      [titulo, descricao, bairro, latitude, longitude, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demanda não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar demanda' });
  }
});

app.delete('/api/demandas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM demandas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demanda não encontrada' });
    }
    res.json({ message: 'Demanda removida com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover demanda' });
  }
});

// Rota para remover localização de uma demanda
app.patch('/api/demandas/:id/remover-localizacao', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE demandas SET latitude = NULL, longitude = NULL WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demanda não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover localização' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
