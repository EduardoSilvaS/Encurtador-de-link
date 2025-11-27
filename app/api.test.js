// app/api.test.js
const request = require('supertest');
const { app, pool } = require('./index');

// Mockamos (simulamos) o 'pg' para não depender do banco de dados real durante os testes
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(() => Promise.resolve({ release: jest.fn() })),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Testes de Integração (API Endpoints)', () => {
  
  // Limpa os mocks antes de cada teste para não haver interferência
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- TESTE DA ROTA POST /encurtar ---
  it('POST /encurtar - Deve criar um link curto com sucesso (201)', async () => {
    // 1. Simulamos a resposta que o banco de dados daria
    const mockDbResponse = { rows: [{ code: 'teste123' }] };
    pool.query.mockResolvedValueOnce(mockDbResponse);

    // 2. Fazemos a requisição falsa
    const res = await request(app)
      .post('/encurtar')
      .send({ longUrl: 'https://www.google.com' });

    // 3. Verificamos se a resposta da API está correta
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('shortUrl');
    // Verifica se a URL retornada contém o código simulado
    expect(res.body.shortUrl).toContain('teste123');
  });

  it('POST /encurtar - Deve retornar erro 400 se não enviar URL', async () => {
    const res = await request(app)
      .post('/encurtar')
      .send({}); // Enviando vazio

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'URL não fornecida.');
  });

  // --- TESTE DA ROTA GET /:code ---
  it('GET /:code - Deve redirecionar se o código existir (301)', async () => {
    // 1. Simulamos que o banco encontrou a URL original
    const mockDbResponse = { rows: [{ original_url: 'https://www.google.com' }] };
    pool.query.mockResolvedValueOnce(mockDbResponse);

    // 2. Acessamos o código 'teste123'
    const res = await request(app).get('/teste123');

    // 3. Esperamos um redirecionamento
    expect(res.statusCode).toBe(301);
    expect(res.headers.location).toBe('https://www.google.com');
  });

  it('GET /:code - Deve retornar 404 se o código não existir', async () => {
    // 1. Simulamos que o banco retornou 0 linhas (não achou nada)
    const mockDbResponse = { rows: [] };
    pool.query.mockResolvedValueOnce(mockDbResponse);

    const res = await request(app).get('/codigoinexistente');

    expect(res.statusCode).toBe(404);
    // Verifica se retornou conteúdo HTML (sua página 404)
    expect(res.type).toBe('text/html');
  });

});