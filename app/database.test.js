// app/database.test.js
const { pool } = require('./index');

describe('Testes Diretos no Banco de Dados (Real)', () => {

  // Variável para guardar o código que vamos criar e depois apagar
  let codigoTeste = 'TESTE_DB';

  // Antes de tudo, garantimos que não existe lixo com esse código
  beforeAll(async () => {
    await pool.query('DELETE FROM links WHERE code = $1', [codigoTeste]);
  });

  // Depois de tudo, limpamos a sujeira para não poluir seu banco
  afterAll(async () => {
    await pool.query('DELETE FROM links WHERE code = $1', [codigoTeste]);
    await pool.end(); // Fecha a conexão para o teste não ficar rodando para sempre
  });

  // Teste 1: Tentar salvar um link na tabela
  test('Deve inserir um novo registro na tabela links', async () => {
    const query = 'INSERT INTO links(code, original_url) VALUES($1, $2) RETURNING *';
    const values = [codigoTeste, 'https://www.google.com'];
    
    const res = await pool.query(query, values);
    
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].code).toBe(codigoTeste);
    expect(res.rows[0].id).toBeDefined(); // Verifica se o ID foi gerado
  });

  // Teste 2: Tentar ler o link que acabamos de salvar
  test('Deve recuperar o registro salvo pelo código', async () => {
    const query = 'SELECT * FROM links WHERE code = $1';
    const res = await pool.query(query, [codigoTeste]);

    expect(res.rows.length).toBe(1);
    expect(res.rows[0].original_url).toBe('https://www.google.com');
  });

});