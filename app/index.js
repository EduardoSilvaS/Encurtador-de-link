// index.js (versão finexitl da lógica)

// Carrega as variáveis do arquivo .env para process.env
require('dotenv').config();

const express = require('express');
const path = require('path');
const { Pool } = require('pg'); // Importa o Pool do driver do PostgreSQL

const app = express();
const PORT = 3000;

// --- Configuração da Conexão com o Banco de Dados ---
// O Pool gerencia múltiplas conexões, é mais eficiente que um Client único.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- Middlewares Essenciais ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- Função Auxiliar para Gerar o Código Curto ---
function generateShortCode(length = 7) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- Rotas da API ---

// 1. Endpoint para encurtar a URL (Lógica Real)
app.post('/encurtar', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'URL não fornecida.' });
  }

  try {
    const code = generateShortCode();

    // Insere o novo link no banco de dados.
    // Usamos query parametrizada ($1, $2) para prevenir SQL Injection.
    const query = 'INSERT INTO links(code, original_url) VALUES($1, $2) RETURNING code';
    const result = await pool.query(query, [code, longUrl]);

    const newCode = result.rows[0].code;
    const shortUrl = `${process.env.BASE_URL}/${newCode}`;

    res.status(201).json({ shortUrl });
  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// 2. Endpoint de Redirecionamento
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const query = 'SELECT original_url FROM links WHERE code = $1';
    const result = await pool.query(query, [code]);

    if (result.rows.length > 0) {
      const originalUrl = result.rows[0].original_url;
      // Redirecionamento permanente (301) para a URL original
      return res.redirect(301, originalUrl);
    } else {
      // Se o código não for encontrado, envia para a página inicial ou uma de erro 404
      return res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); // (Bônus: criar um 404.html!)
    }
  } catch (error) {
    console.error('Erro ao buscar no banco de dados:', error);
    return res.status(500).send('Erro interno do servidor.');
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});