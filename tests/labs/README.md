# Labs - Testes Experimentais

Este diretório contém testes experimentais e exemplos para aprender conceitos de teste.

## Arquivos

### `mock-examples.test.ts`
Exemplos completos de como usar mocks no Vitest:
- Mock de funções assíncronas
- Mock de erros
- Mock com implementação customizada
- Verificação de chamadas
- Casos de sucesso e erro

### `test-mock-basic.test.ts`
Teste básico original para entender problemas de hoisting com mocks.

## Como executar

```bash
# Executar todos os labs
npm test tests/labs/

# Executar exemplo específico
npm test tests/labs/mock-examples.test.ts

# Com debug
LOGGER_LEVEL=debug npm test tests/labs/mock-examples.test.ts
```

## Service de Exemplo

O arquivo `tests/utils/labs/example.service.ts` contém um service simples para praticar mocks sem usar código real da aplicação.

### Funcionalidades:
- `create(tenantId, data)` - Criar usuário
- `findById(tenantId, id)` - Buscar por ID
- `update(tenantId, id, data)` - Atualizar usuário

## Conceitos Demonstrados

1. **Mock Correto**: Como evitar problemas de hoisting
2. **vi.mocked()**: Como acessar funções mockadas
3. **mockResolvedValue()**: Mock de promises que resolvem
4. **mockRejectedValue()**: Mock de promises que rejeitam
5. **mockImplementation()**: Mock com lógica customizada
6. **Verificações**: Como verificar se mocks foram chamados corretamente

## Regras Importantes

- `vi.mock()` ANTES dos imports
- Usar `vi.fn()` dentro do mock factory
- Usar `vi.mocked()` para acessar funções mockadas
- NUNCA usar variáveis externas no mock factory (hoisting error)