# REGRA CRÍTICA: IA E MOCKS - SUPERVISÃO OBRIGATÓRIA

## REGRAS PARA IA COM MOCKS

### NUNCA FAÇA SEM SUPERVISÃO TOTAL DO HUMANO
- **CRIAR** código com vi.mock() - PROIBIDO sem supervisão
- **ALTERAR** código existente com mocks - PROIBIDO sem supervisão  
- **APAGAR** código que usa mocks - PROIBIDO sem supervisão
- **SUGERIR** uso de mocks - PROIBIDO sem supervisão

## SUPERVISÃO OBRIGATÓRIA

**TODA OPERAÇÃO COM MOCK PRECISA DE:**
- **Acompanhamento total** do humano
- **Aprovação explícita** antes de qualquer mudança
- **Revisão completa** do código com mock
- **Validação** de que o mock é realmente necessário

## REGRAS ESPECÍFICAS

### ✅ PERMITIDO COM SUPERVISÃO
- Criar mocks **APENAS** com aprovação explícita do humano
- Alterar mocks existentes **APENAS** com supervisão total
- Remover mocks **APENAS** com confirmação do humano

### ❌ PROIBIDO ABSOLUTO
- Criar, alterar ou remover mocks **SEM** supervisão
- Sugerir mocks como primeira opção
- Modificar testes com mocks sem aprovação

## ALTERNATIVAS PRIORITÁRIAS (SEMPRE TENTAR PRIMEIRO)

### Para cobertura de código:
- **Foque em testar lógica de negócio real**
- **Use MongoDB em memória** para testes completos

### Para testes de erro:
- **Use dados inválidos** que causem erros reais
- **Teste cenários de erro através da API** (400, 404, 500)
- **Use banco em memória** para simular estados de erro

### Para isolamento:
- **Use dados reais** sempre que possível
- **MongoDB em memória** está disponível para todos os testes
- **getTenantId()** para criar contextos isolados

### Quando mocks são realmente necessários:
- **APIs externas** que não podem ser testadas
- **Operações custosas** (filesystem, rede)
- **Comportamentos não determinísticos** (Date.now, random)
- **SEMPRE com supervisão total do humano**

## EXEMPLOS DE USO COM SUPERVISÃO

```typescript
// ⚠️ APENAS COM SUPERVISÃO TOTAL DO HUMANO
// Humano deve aprovar explicitamente antes de criar:
vi.mock('@/external-api-service'); // OK se humano aprovar
vi.mocked(service.create).mockReturnValue(fake); // OK se humano aprovar
service.create = vi.fn().mockResolvedValue(fake); // OK se humano aprovar

// ❌ PROIBIDO SEM SUPERVISÃO
// IA não pode criar, alterar ou remover sem aprovação
```

## EXEMPLOS CORRETOS

```typescript
// ✅ CORRETO - Teste real com dados inválidos
it('should handle validation error', async () => {
  await expect(
    service.create(tenantId, { email: 'invalid' })
  ).rejects.toThrow(ValidationError);
});

// ✅ CORRETO - Foque em testar lógica de negócio real
```

## PROCESSO OBRIGATÓRIO

### Antes de qualquer operação com mock:
1. **PERGUNTE** ao humano se pode prosseguir
2. **EXPLIQUE** por que o mock seria necessário
3. **AGUARDE** aprovação explícita
4. **EXECUTE** apenas com supervisão total

### Frases obrigatórias:
- "Preciso de supervisão para trabalhar com mocks"
- "Posso criar/alterar/remover este mock com sua aprovação?"
- "Este código tem mocks, preciso de sua orientação"

## LEMBRE-SE

**MOCK SEM SUPERVISÃO = PROIBIDO**

**IA: Sempre pedir supervisão para mocks**
**HUMANO: Controle total sobre uso de mocks**