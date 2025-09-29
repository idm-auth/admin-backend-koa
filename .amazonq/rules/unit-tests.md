# Regras para Testes Unitários

## Princípios Gerais
- **Teste comportamento real, não mocks artificiais**
- Use mocks apenas quando absolutamente necessário
- Prefira dados reais a retornos mockados
- Valide o resultado, não apenas se a função foi chamada

## Quando NÃO usar mocks
- ❌ **NUNCA** mocke apenas para forçar um retorno específico
- ❌ **NUNCA** use `mockReturnValueOnce()` sem necessidade real
- ❌ **NUNCA** mocke bibliotecas que podem ser testadas diretamente
- ❌ **NUNCA** mocke para "facilitar" o teste

## Exemplos INCORRETOS
```typescript
// ❌ Mock desnecessário - força retorno fake
mockJwt.verify.mockReturnValueOnce(mockPayload);

// ❌ Mock que não testa comportamento real
mockService.findById.mockResolvedValue(account);

// ❌ Mock complexo sem necessidade
vi.mock('jsonwebtoken', async () => {
  const actual = await vi.importActual('jsonwebtoken');
  return { ...actual, verify: vi.fn() };
});
```

## Exemplos CORRETOS
```typescript
// ✅ Teste real - gera e verifica token
const token = await jwtService.generateToken(tenantId, payload);
const result = await jwtService.verifyToken(tenantId, token);

// ✅ Teste de erro com dados inválidos reais
await expect(
  jwtService.verifyToken(tenantId, 'token-invalido')
).rejects.toThrow();

// ✅ Mock apenas para dependências externas (DB, APIs)
vi.mock('@/services/external-api.service');
```

## Quando usar mocks
- ✅ Dependências externas (APIs, banco de dados)
- ✅ Operações custosas (filesystem, rede)
- ✅ Comportamentos não determinísticos (datas, random)
- ✅ Isolamento de unidade específica

## Validações
- Sempre valide propriedades específicas do resultado
- Use `toHaveProperty()` para verificar estrutura
- Teste cenários de sucesso E erro
- Verifique tipos de retorno quando relevante

## Estrutura de Teste
```typescript
describe('Service', () => {
  // Setup mínimo
  beforeAll(async () => {
    // Apenas configuração essencial
  });

  it('deve executar operação com sucesso', async () => {
    // Dados reais
    const result = await service.operation(realData);
    
    // Validações específicas
    expect(result).toHaveProperty('id');
    expect(result.status).toBe('success');
  });

  it('deve lançar erro para dados inválidos', async () => {
    // Dados inválidos reais
    await expect(
      service.operation(invalidData)
    ).rejects.toThrow('Expected error message');
  });
});
```