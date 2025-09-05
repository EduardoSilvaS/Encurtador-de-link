// index.js (versão atualizada)

const express = require('express');
const path = require('path'); // Módulo nativo do Node.js para lidar com caminhos de arquivos

const app = express();
const PORT = 3000;

// --- Middlewares Essenciais ---

// 1. Servir arquivos estáticos
// Diz ao Express para servir qualquer arquivo que estiver na pasta 'public'
// É assim que nosso index.html será encontrado e enviado para o navegador.
app.use(express.static(path.join(__dirname, 'public')));

// 2. Parser de JSON
// Permite que nosso servidor entenda o corpo de requisições enviado como JSON.
// Essencial para o nosso endpoint '/encurtar'.
app.use(express.json());


// --- Rotas da API ---

// Endpoint para encurtar a URL
// Por enquanto, ele apenas simula o funcionamento.
app.post('/encurtar', (req, res) => {
  const longUrl = req.body.longUrl;

  console.log('URL recebida para encurtar:', longUrl);

  if (!longUrl) {
    return res.status(400).json({ error: 'URL não fornecida.' });
  }

  // Lógica de verdade virá aqui (gerar código, salvar no banco, etc.)
  // Por enquanto, vamos retornar um link "fake".
  const fakeShortUrl = `http://192.168.56.10/xY7zAbC`;

  res.json({ shortUrl: fakeShortUrl });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});