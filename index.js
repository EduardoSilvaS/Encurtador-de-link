// index.js

// Importa a biblioteca Express
const express = require('express');

// Cria uma instância do Express
const app = express();

// Define a porta em que o servidor vai rodar. É importante usar uma porta acima de 1024.
const PORT = 3000;

// Rota principal (endpoint de teste)
// Quando alguém acessar a raiz do site (GET /), esta função será executada.
app.get('/', (req, res) => {
  res.json({ message: "Hello World" });
});

// Inicia o servidor e o faz "escutar" por requisições na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});