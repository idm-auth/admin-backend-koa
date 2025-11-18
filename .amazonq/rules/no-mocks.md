# Regra: Mocks Apenas com Supervisão Total

## LEITURA OBRIGATÓRIA

**ANTES DE USAR QUALQUER MOCK, LEIA:**

- **`.docs/mock-patterns.md`** - Padrões vi.mock() vs vi.spyOn()
- **Quando vi.mock() falha** e como usar vi.spyOn()
- **Problemas de timing** com imports complexos

## SUPERVISÃO OBRIGATÓRIA

### IA PRECISA APROVAÇÃO para:

- Criar qualquer código com vi.mock() ou vi.spyOn()
- Alterar código existente que usa mocks
- Remover código que contém mocks
- Sugerir uso de mocks como solução

### EVITAR MOCKS para:

- Simular comportamentos que podem ser testados com dados reais
- "Facilitar" testes que podem usar MongoDB em memória
- Forçar retornos específicos sem necessidade real
- Testar cenários que não existem na realidade
- Contornar problemas de configuração

## PERMITIDO COM SUPERVISÃO

### Use mocks APENAS para (com aprovação):

- APIs externas reais (HTTP requests)
- Operações de filesystem quando necessário
- Bibliotecas de terceiros custosas (bcrypt em alguns casos)
- Comportamentos não determinísticos (Date.now, Math.random)
- **SEMPRE com supervisão total do humano**

## PRINCÍPIO FUNDAMENTAL

**Se você pode testar com dados reais, SEMPRE teste com dados reais.**

### MongoDB em memória está disponível

- Use `getTenantId()` para criar realms
- Crie dados reais para testar
- Teste comportamento real, não simulado

### Exemplos CORRETOS:

```typescript
// ✅ Teste real com banco em memória
const tenantId = await getTenantId('test-unique-name');
const account = await accountService.create(tenantId, {
  email: createTestEmail('prefix') // Test credential - not production,
  password: ',
});
expect(account).toHaveProperty('_id');
```

### Exemplos que PRECISAM SUPERVISÃO:

```typescript
// ⚠️ Precisa aprovação do humano - vi.mock()
vi.mock('@/external-service', () => ({ call: vi.fn() }));
vi.mocked(externalApiService.call).mockResolvedValue(fakeResponse);

// ⚠️ Precisa aprovação do humano - vi.spyOn()
vi.spyOn(Date, 'now').mockReturnValue(fixedTimestamp);
vi.spyOn(service, 'method').mockRejectedValue(new Error('Test'));
```

## PADRÕES DE MOCK

### vi.mock() vs vi.spyOn()

- **vi.mock()**: Para testes diretos de service
- **vi.spyOn()**: Para testes através de controller
- **Leia `.docs/mock-patterns.md`** para detalhes completos

### Quando vi.mock() Falha

- Testes indiretos (controller → service)
- Imports complexos com timing issues
- **Solução**: Use vi.spyOn() com supervisão

## CONSEQUÊNCIAS

Mocks desnecessários:

- Não testam código real
- Criam falsa sensação de segurança
- Quebram quando código muda
- Não detectam bugs reais
- São gambiarras disfarçadas

## REGRA DE OURO

**Se você está considerando usar mocks:**

1. **PARE** e pergunte: "Posso testar isso com dados reais?"
2. **TENTE** alternativas com MongoDB em memória primeiro
3. **PEÇA SUPERVISÃO** se mock for realmente necessário
4. **AGUARDE APROVAÇÃO** antes de implementar

**A resposta para dados reais é quase sempre SIM.**
