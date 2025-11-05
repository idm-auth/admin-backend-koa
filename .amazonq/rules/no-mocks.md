# Regra: NUNCA Use Mocks Desnecessários

## PROIBIDO

### NUNCA use vi.mock() para:
- Simular comportamentos que podem ser testados com dados reais
- "Facilitar" testes
- Forçar retornos específicos sem necessidade real
- Testar cenários que não existem na realidade
- Contornar problemas de configuração

### NUNCA use vi.mocked() para:
- Mockar services que podem usar banco em memória
- Mockar funções que funcionam perfeitamente
- Criar cenários artificiais

### NUNCA use mockImplementation() para:
- Simular erros que não acontecem na prática
- Substituir lógica real por lógica fake
- "Testar" código que não está sendo executado

## PERMITIDO

### Use mocks APENAS para:
- APIs externas reais (HTTP requests)
- Operações de filesystem quando necessário
- Bibliotecas de terceiros custosas (bcrypt em alguns casos)
- Comportamentos não determinísticos (Date.now, Math.random)

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

### Exemplos PROIBIDOS:
```typescript
// ❌ Mock desnecessário
vi.mocked(accountService.create).mockResolvedValue(fakeAccount);

// ❌ Mock para simular erro inexistente
vi.spyOn(Model, 'find').mockImplementation(() => {
  throw new Error('Fake error');
});

// ❌ Mock para "facilitar" teste
vi.mock('@/service', () => ({ create: vi.fn() }));
```

## CONSEQUÊNCIAS

Mocks desnecessários:
- Não testam código real
- Criam falsa sensação de segurança
- Quebram quando código muda
- Não detectam bugs reais
- São gambiarras disfarçadas

## REGRA DE OURO

**Se você está usando vi.mock(), vi.mocked(), ou mockImplementation(), PARE e pergunte: "Posso testar isso com dados reais?"**

**A resposta é quase sempre SIM.**