# Padrões de Mock - vi.mock() vs vi.spyOn()

## Problema Identificado

Durante o desenvolvimento dos testes, descobrimos que `vi.mock()` nem sempre funciona em cenários complexos, especialmente quando testamos **indiretamente** através de controllers que importam services.

## Análise do Problema

### ✅ **vi.mock() Funciona (Testes Diretos)**
```typescript
// Testando service diretamente
vi.mock('@/service', () => ({ create: vi.fn() }));
import * as service from '@/service';

// ✅ Funciona perfeitamente
await service.create(data); // Mock é chamado
```

### ❌ **vi.mock() Falha (Testes Indiretos)**
```typescript
// Testando através de controller
vi.mock('@/service', () => ({ create: vi.fn() }));
import * as controller from '@/controller'; // Controller importa service
import * as service from '@/service';

// ❌ Mock não funciona - service real é chamado
await controller.create(ctx); // Chama service real, não o mock
```

## Causa Raiz

### **Problema de Timing e Referências**

1. **Controller importa service** antes do mock ser aplicado
2. **Controller "captura" referência original** do service
3. **Mock substitui o módulo**, mas controller já tem a referência antiga
4. **Resultado**: Controller chama service real, não o mockado

### **Evidência do Debug**
```
=== MOCK DEBUG ===
Is mock function: true ✅ (Mock está ativo)
Mock calls: 0 ❌ (Mock nunca foi chamado)
ctx.status: 201 ❌ (Controller executou service real)
```

## Soluções

### **Solução 1: vi.spyOn() (Recomendada para Controllers)**

```typescript
describe('Controller Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // Limpa spies automaticamente
  });

  it('should handle errors', async () => {
    // ✅ spyOn substitui na execução, não na importação
    const createSpy = vi.spyOn(service, 'create');
    createSpy.mockRejectedValue(new Error('Test error'));

    await expect(controller.create(ctx)).rejects.toThrow('Test error');
    expect(createSpy).toHaveBeenCalled();
    // mockRestore() não necessário - beforeEach cuida
  });
});
```

### **Solução 2: vi.mock() (Ideal para Services)**

```typescript
// ✅ Para testes diretos de service
vi.mock('@/external-service', () => ({ call: vi.fn() }));

describe('Service Tests', () => {
  it('should call external service', async () => {
    const mockCall = vi.mocked(externalService.call);
    mockCall.mockResolvedValue(data);

    await service.processData(); // Funciona perfeitamente
    expect(mockCall).toHaveBeenCalled();
  });
});
```

## Padrões Recomendados

### **Por Tipo de Teste**

| Tipo de Teste | Abordagem | Razão |
|---------------|-----------|-------|
| **Service Direto** | `vi.mock()` | Isolamento total, performance |
| **Controller** | `vi.spyOn()` | Funciona com dependências complexas |
| **Integration** | Dados reais | Testa fluxo completo |

### **Por Complexidade**

| Cenário | Solução | Exemplo |
|---------|---------|---------|
| **Simples** | `vi.mock()` | Service → External API |
| **Complexo** | `vi.spyOn()` | Controller → Service → Model |
| **Muito Complexo** | Dados reais | End-to-end com banco |

## Implementação Prática

### **Template para Controller Tests**
```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Sem mocks globais para controllers
import * as controller from '@/controller';
import * as service from '@/service';

describe('Controller Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // Limpa spies automaticamente
  });

  it('should handle service errors', async () => {
    const serviceSpy = vi.spyOn(service, 'method');
    serviceSpy.mockRejectedValue(new Error('Service error'));

    await expect(controller.method(ctx)).rejects.toThrow('Service error');
    expect(serviceSpy).toHaveBeenCalledWith(expectedArgs);
  });
});
```

### **Template para Service Tests**
```typescript
// Mock global para services
vi.mock('@/external-dependency', () => ({
  method: vi.fn(),
}));

import * as service from '@/service';
import * as dependency from '@/external-dependency';

describe('Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call dependency', async () => {
    const mockMethod = vi.mocked(dependency.method);
    mockMethod.mockResolvedValue(data);

    await service.processData();
    expect(mockMethod).toHaveBeenCalled();
  });
});
```

## Vantagens e Desvantagens

### **vi.mock()**
**✅ Vantagens:**
- Isolamento total da unidade
- Performance superior
- Menos código boilerplate
- Substitui completamente o módulo

**❌ Desvantagens:**
- Problemas com imports complexos
- Timing issues com controllers
- Menos flexível para cenários dinâmicos

### **vi.spyOn()**
**✅ Vantagens:**
- Funciona sempre, independente da complexidade
- Flexível para configuração dinâmica
- Não depende da ordem de imports

**❌ Desvantagens:**
- Não é isolamento total (intercepta, não substitui)
- Mais código para gerenciar
- Performance ligeiramente inferior
- Risco de executar código real se mal configurado

## Regras de Decisão

### **Use vi.mock() quando:**
- Testando service diretamente
- Dependências simples e bem definidas
- Quer isolamento total
- Performance é crítica

### **Use vi.spyOn() quando:**
- Testando através de controller
- Dependências complexas (controller → service → model)
- vi.mock() não funciona
- Precisa de flexibilidade dinâmica

### **Use dados reais quando:**
- Testando integração completa
- Mock seria mais complexo que o código real
- Quer garantir que tudo funciona junto
- Performance não é crítica

## Exemplo Completo

### **Cenário: Controller que usa Service**

```typescript
// account.controller.ts
export const create = async (ctx: Context) => {
  try {
    const account = await accountService.create(tenantId, data);
    ctx.body = accountMapper.toResponse(account);
  } catch (error) {
    throw error; // Propaga erro do service
  }
};
```

### **Teste com vi.spyOn() (Funciona)**
```typescript
describe('account.controller error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should propagate service errors', async () => {
    // ✅ spyOn funciona mesmo com controller complexo
    const createSpy = vi.spyOn(accountService, 'create');
    createSpy.mockRejectedValue(new Error('Service error'));

    await expect(controller.create(ctx)).rejects.toThrow('Service error');
    expect(createSpy).toHaveBeenCalledWith(tenantId, data);
  });
});
```

### **Teste com vi.mock() (Falha)**
```typescript
// ❌ Não funciona - controller já tem referência ao service real
vi.mock('@/account.service', () => ({ create: vi.fn() }));

describe('account.controller error handling', () => {
  it('should propagate service errors', async () => {
    const mockCreate = vi.mocked(accountService.create);
    mockCreate.mockRejectedValue(new Error('Service error'));

    // ❌ Falha: controller chama service real, não o mock
    await expect(controller.create(ctx)).rejects.toThrow('Service error');
  });
});
```

## Conclusão

A escolha entre `vi.mock()` e `vi.spyOn()` depende da **complexidade das dependências**:

- **Testes simples/diretos**: `vi.mock()` é ideal
- **Testes complexos/indiretos**: `vi.spyOn()` é necessário
- **Testes de integração**: Dados reais são preferíveis

O importante é entender **quando** e **por que** cada abordagem funciona, para fazer a escolha certa em cada cenário.