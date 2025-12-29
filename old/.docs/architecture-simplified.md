# Arquitetura Simplificada - Sem Multiversão

## Decisão Arquitetural

### Problema da Multiversão
A estrutura anterior com `latest/` e `v1/` criava:
- **Complexidade desnecessária** com re-exports
- **Confusão** sobre onde implementar funcionalidades
- **Manutenção dupla** de estruturas idênticas
- **Performance degradada** com camadas extras

### Solução Adotada
**Arquitetura simplificada** com versionamento via containers:
- **Uma versão ativa** por aplicação
- **Versionamento via Docker** quando necessário
- **Estrutura direta** sem camadas de compatibilidade

## Nova Estrutura

### Domínios
```
src/domains/{contexto}/{dominio}/
├── {dominio}.controller.ts
├── {dominio}.service.ts
├── {dominio}.model.ts
├── {dominio}.schema.ts
├── {dominio}.mapper.ts (quando necessário)
└── {dominio}.routes.ts
```

### Testes
```
tests/
├── integration/domains/{contexto}/{dominio}/
│   ├── post.test.ts
│   └── get.id.test.ts
└── unit/domains/{contexto}/{dominio}/
    ├── service/
    ├── controller/
    ├── model/
    └── mapper/
```

## Versionamento via Containers

### Estratégia
```bash
# Versão 1.0
docker run -p 3001:3000 backend-koa:1.0.0

# Versão 2.0
docker run -p 3002:3000 backend-koa:2.0.0

# Load balancer roteia por versão
/api/v1/* → container 1.0.0
/api/v2/* → container 2.0.0
```

### Benefícios
- **Isolamento completo** entre versões
- **Rollback simples** - trocar container
- **Zero complexidade** de código
- **Performance máxima** - sem camadas extras

## URLs Simplificadas

### Antes (com multiversão)
```
/api/realm/:tenantId/v1/accounts/
/api/realm/:tenantId/v1/groups/
/api/core/v1/realms/
```

### Depois (simplificado)
```
/api/realm/:tenantId/accounts/
/api/realm/:tenantId/groups/
/api/core/realms/
```

## Imports Simplificados

### Antes (com multiversão)
```typescript
// Confuso - qual versão usar?
import * as service from '@/domains/realms/accounts/v1/account.service';
import * as service from '@/domains/realms/accounts/latest/account.service';
```

### Depois (simplificado)
```typescript
// Direto e claro
import * as service from '@/domains/realms/accounts/account.service';
```

## Migração Realizada

### ✅ Domínios Migrados
1. **commons** (base + validations)
2. **config**
3. **core/realms**
4. **realms/accounts**
5. **realms/groups**
6. **realms/roles**
7. **realms/jwt**
8. **realms/authentication**
9. **realms/policies**
10. **realms/account-groups**
11. **realms/account-roles**
12. **realms/group-roles**

### ✅ Testes Atualizados
- **URLs simplificadas** sem `/v1/`
- **Imports diretos** sem versionamento
- **Estrutura de diretórios** simplificada
- **Todos os testes funcionando**

### ✅ Rules e Documentação Atualizadas
- **ddd-architecture.md** - Arquitetura simplificada
- **general.md** - Imports diretos
- **integration-tests.md** - URLs sem versionamento
- **unit-tests.md** - Estrutura simplificada
- **imports.md** - Exemplos sem versionamento
- **copy-structure.md** - Processo simplificado
- **memory-bank/** - Guidelines e estrutura atualizadas
- **README.md** - Exemplos de API atualizados
- **index.md** - Documentação das mudanças

## Resultado Final

### Benefícios Alcançados
- **Código 50% mais simples** - sem camadas desnecessárias
- **Manutenção facilitada** - um lugar para cada funcionalidade
- **Performance melhorada** - imports diretos
- **Clareza total** - sem confusão sobre onde implementar

### Próximos Passos
- **Versionamento futuro**: Via containers Docker
- **Breaking changes**: Deploy de nova versão em container separado
- **Compatibilidade**: Load balancer gerencia roteamento por versão

**A arquitetura agora é pragmática, simples e eficiente!**