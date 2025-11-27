const { generateShortCode } = require('./generateShortCode');

describe('Gerador de Códigos Curtos (Unitários)', () => {

  // Teste 1: Verifica o comportamento padrão
  test('Deve gerar um código com exatamente 7 caracteres por padrão', () => {
    const codigo = generateShortCode();
    expect(codigo.length).toBe(7);
  });

  // Teste 2: Verifica o tamanho personalizado
  test('Deve gerar um código com o tamanho solicitado (ex: 10)', () => {
    const tamanho = 10;
    const codigo = generateShortCode(tamanho);
    expect(codigo.length).toBe(tamanho);
  });

  // Teste 3: Verifica caracteres permitidos
  test('Deve conter apenas caracteres alfanuméricos', () => {
    const codigo = generateShortCode(20); 
    const regexAlfanumerico = /^[a-zA-Z0-9]+$/;
    expect(regexAlfanumerico.test(codigo)).toBe(true);
  });

  // Teste 4: Caso de Borda (Zero)
  test('Deve retornar uma string vazia se o tamanho solicitado for 0', () => {
    const codigo = generateShortCode(0);
    expect(codigo).toBe('');
  });

  // Teste 5: Verificação de Tipo
  test('Deve garantir que o retorno é sempre do tipo string', () => {
    const codigo = generateShortCode();
    expect(typeof codigo).toBe('string');
  });

  // Teste 6: Unicidade simples
  // Objetivo: Garantir que chamar a função duas vezes gera códigos diferentes
  test('Deve gerar códigos diferentes em chamadas consecutivas', () => {
    const codigo1 = generateShortCode();
    const codigo2 = generateShortCode();
    expect(codigo1).not.toBe(codigo2);
  });

  // Teste 7: Caso de Borda (Negativo)
  // Objetivo: Garantir que números negativos não quebram o código (deve retornar vazio)
  test('Deve retornar string vazia se o tamanho for negativo', () => {
    const codigo = generateShortCode(-5);
    expect(codigo).toBe('');
  });

});