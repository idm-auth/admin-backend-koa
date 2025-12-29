# Labs Utils - Elementos para Testes

Este diretório contém elementos auxiliares para demonstrar problemas e soluções de mocks.

## Estrutura

### `example.service.ts` - Service Simples
- Service básico para praticar mocks
- Funções: create, findById, update
- Usado em `tests/labs/mock-examples.test.ts`

### `latest/` - Implementação Real
- **`product.service.ts`** - Service com implementação real
- **`product.controller.ts`** - Controller que usa import relativo `./product.service`

### `v1/` - Re-exports
- **`product.service.ts`** - Re-export do latest service
- **`product.controller.ts`** - Re-export do latest controller

## Problema Demonstrado

### Cadeia de Imports:
1. Teste importa: `v1/product.controller`
2. v1/controller re-exporta: `latest/product.controller`  
3. latest/controller importa: `./product.service` (latest/product.service)
4. **Para mockar, precisa mockar: `latest/product.service`**

### Por que o problema acontece:
- **Mock errado**: `vi.mock('@test/utils/labs/v1/product.service')`
- **Mock correto**: `vi.mock('@test/utils/labs/latest/product.service')`

### Demonstração:
```typescript
// Estas são a MESMA função devido ao re-export
v1Service.create === latestService.create // true
v1Controller.create === latestController.create // true
```

## Como Usar

Veja o teste `tests/labs/re-export-problem.test.ts` para exemplos completos de:
- Mock funcionando corretamente
- Demonstração da cadeia de re-exports
- Processo de debugging
- Lições aprendidas

## Lição Principal

**Sempre siga a cadeia de imports até o final para descobrir qual módulo realmente precisa ser mockado!**