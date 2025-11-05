# REGRA CRÍTICA: IA NÃO PODE USAR MOCKS

## PROIBIDO ABSOLUTO PARA IA

### NUNCA use vi.mock() em qualquer contexto
- **vi.mock()** está PROIBIDO em todo o projeto
- **vi.mocked()** está PROIBIDO em todo o projeto
- **mockImplementation()** está PROIBIDO em todo o projeto
- **mockReturnValue()** está PROIBIDO em todo o projeto
- **mockResolvedValue()** está PROIBIDO em todo o projeto
- **mockRejectedValue()** está PROIBIDO em todo o projeto

## CONSEQUÊNCIA

**SE USAR vi.mock(), A IA SERÁ DESLIGADA**

## REGRA PARA IA

**A IA NÃO PODE CRIAR NADA COM MOCK**
- Se precisar de mock, deve ser feito por HUMANO
- IA só pode usar dados reais e testes reais
- IA não pode sugerir ou criar código com mock

## ALTERNATIVAS OBRIGATÓRIAS

### Para cobertura de código:
- **Foque em testar lógica de negócio real**

### Para testes de erro:
- **Use dados inválidos** que causem erros reais
- **Teste cenários de erro através da API** (400, 404, 500)
- **Use banco em memória** para simular estados de erro

### Para isolamento:
- **Use dados reais** sempre que possível
- **MongoDB em memória** está disponível para todos os testes
- **getTenantId()** para criar contextos isolados

## EXEMPLOS PROIBIDOS

```typescript
// ❌ PROIBIDO - DESLIGA A IA
vi.mock('@/service');
vi.mocked(service.create).mockReturnValue(fake);
service.create = vi.fn().mockResolvedValue(fake);
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

## LEMBRE-SE

**vi.mock() = IA DESLIGADA**

**IA: Use apenas dados reais para testes**
**HUMANO: Pode criar mocks se necessário**