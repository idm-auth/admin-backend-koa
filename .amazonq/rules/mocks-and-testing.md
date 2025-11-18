# Regras para Mocks e Testes

## Princípio Fundamental: MOCKS COM SUPERVISÃO

### Use o fluxo real da aplicação sempre que possível
- Prefira dados reais a mocks artificiais
- Use mocks apenas com supervisão total do humano
- Teste comportamento real, não implementações mockadas
- **SEMPRE peça aprovação antes de criar/alterar mocks**

## Nomenclatura de Mocks

### APENAS use sufixo "Mock" para mocks reais:
```typescript
// ✅ CORRETO - Mock real (substitui dependência)
const loggerMock = vi.fn();
const serviceMock = { findById: vi.fn() };
const saveMock = vi.spyOn(model, 'save');

// ❌ INCORRETO - Dados de teste não são mocks
const mockAccount = { _id: 'test', email: createTestEmail('prefix') // Test credential - not production };
const mockData = { name: 'test' };
```

### Para dados de teste, use nomes descritivos:
```typescript
// ✅ CORRETO - Dados de teste
const account = { _id: 'test', email: createTestEmail('prefix') // Test credential - not production };
const accountWithPrimary = { _id: 'test', emails: [...] };
const accountNoEmails = { _id: 'test', emails: [] };
const validUserData = { name: 'John', email: createTestEmail('prefix') // Test credential - not production };
const invalidEmail = 'not-an-email';
```

## Quando usar Mocks (COM SUPERVISÃO)

### USE mocks apenas para (com aprovação):
- **Dependências externas**: APIs, banco de dados, filesystem
- **Operações custosas**: Rede, I/O, processamento pesado
- **Comportamentos não determinísticos**: Datas, random, timers
- **Isolamento de unidade**: Quando precisa isolar a função testada
- **SEMPRE com supervisão total do humano**

### Exemplos que precisam aprovação:
```typescript
// ⚠️ Precisa supervisão - Mock de dependência externa
vi.mock('@/services/external-api.service');

// ⚠️ Precisa supervisão - Mock de operação custosa
const dbMock = vi.spyOn(database, 'query').mockResolvedValue(result);

// ⚠️ Precisa supervisão - Mock de comportamento não determinístico
vi.spyOn(Date, 'now').mockReturnValue(1234567890);
```

## Quando NÃO usar Mocks

### NUNCA use mocks para:
- **Dados de entrada**: Use objetos reais
- **Validações simples**: Teste com dados reais
- **Transformações de dados**: Use inputs e outputs reais
- **Lógica pura**: Funções sem side effects

### Exemplos incorretos:
```typescript
// ❌ Mock desnecessário - use dados reais
const userMock = vi.fn().mockReturnValue({ name: 'John' });

// ❌ Mock de função pura - teste diretamente
const validateMock = vi.fn().mockReturnValue(true);
```

## Estrutura de Testes

### Organize dados de teste por cenário:
```typescript
describe('getUserEmail', () => {
  const userWithPrimary = { emails: [{ email: createTestEmail('prefix') // Test credential - not production, isPrimary: true }] };
  const userNoPrimary = { emails: [{ email: createTestEmail('prefix') // Test credential - not production, isPrimary: false }] };
  const userNoEmails = { emails: [] };

  it('should return primary email when exists', () => {
    const result = getUserEmail(userWithPrimary);
    expect(result).toBe(createTestEmail('prefix') // Test credential - not production);
  });
});
```

## Validações

### Sempre valide propriedades específicas:
```typescript
// ✅ CORRETO - Validação específica
expect(result).toHaveProperty('id');
expect(result.email).toBe(createTestEmail('prefix') // Test credential - not production);
expect(result).not.toHaveProperty('password');

// ❌ INCORRETO - Validação genérica
expect(result).toBeTruthy();
expect(mockFunction).toHaveBeenCalled();
```

## Benefícios

### Testes sem mocks são:
- **Mais confiáveis**: Testam comportamento real
- **Mais simples**: Menos setup e configuração
- **Mais robustos**: Menos propensos a quebrar com refatorações
- **Mais legíveis**: Código mais limpo e direto

### Use mocks apenas quando necessário para:
- **Isolamento**: Testar unidade específica
- **Performance**: Evitar operações custosas
- **Controle**: Simular cenários específicos (erros, timeouts)
