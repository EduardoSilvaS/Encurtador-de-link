// Carrega as variáveis do arquivo .env para process.env
require('dotenv').config();

const express = require('express');
const path = require('path');
const { generateShortCode } = require('./generateShortCode'); 
const { Pool } = require('pg'); // Importa o Pool do driver do PostgreSQL

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuração da Conexão com o Banco de Dados ---
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

// --- Middlewares Essenciais ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// --- Rotas da API ---

// 1. Endpoint para encurtar a URL (Lógica Real)
app.post('/encurtar', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'URL não fornecida.' });
  }
  try {
    const code = generateShortCode();
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
      return res.redirect(301, originalUrl);
    } else {
      return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
  } catch (error) {
    console.error('Erro ao buscar no banco de dados:', error);
    return res.status(500).send('Erro interno do servidor.');
  }
});


async function startServer() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Conexão com o banco de dados estabelecida!');
    client.release();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err);
    // Em produção, talvez você queira dar exit(1), mas para teste vamos apenas logar
  }
}

// Só iniciamos o servidor se este arquivo for executado diretamente (node index.js)
// Se for importado pelo Jest, não fazemos nada automático.
if (require.main === module) {
  startServer();
}

// Exportamos o app e o pool para usar nos testes
module.exports = { app, pool };