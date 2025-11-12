# Regra: Mocks Apenas com Supervisão Total

## SUPERVISÃO OBRIGATÓRIA

### IA PRECISA APROVAÇÃO para:
- Criar qualquer código com vi.mock()
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
  email: 'test@example.com',
  password: 'Password123!',
});
expect(account).toHaveProperty('_id');
```

### Exemplos que PRECISAM SUPERVISÃO:
```typescript
// ⚠️ Precisa aprovação do humano
vi.mocked(externalApiService.call).mockResolvedValue(fakeResponse);

// ⚠️ Precisa aprovação do humano
vi.spyOn(Date, 'now').mockReturnValue(fixedTimestamp);

// ⚠️ Precisa aprovação do humano
vi.mock('@/external-service', () => ({ call: vi.fn() }));
```

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