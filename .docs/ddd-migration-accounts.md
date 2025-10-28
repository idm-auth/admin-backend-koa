# Migração DDD - Accounts

## Resumo da Migração

Este documento descreve a migração do módulo `accounts` da estrutura tradicional por tipo (controllers, services, models) para a nova arquitetura Domain-Driven Design (DDD).

## Estrutura Final

### 📁 Código Fonte
```
src/domains/realms/accounts/
├── latest/
│   ├── account.controller.ts
│   ├── account.service.ts
│   ├── account.model.ts
│   └── account.schema.ts
└── v1/
    ├── account.controller.ts (re-export do latest)
    ├── account.service.ts (re-export do latest)
    ├── account.model.ts (re-export do latest)
    └── account.schema.ts (re-export do latest)
```

### Testes
```
tests/integration/domains/realms/accounts/
└── v1/
    ├── post.test.ts
    ├── get.id.test.ts
    └── get.search.test.ts
```

## Vantagens da Nova Estrutura

### Organização por Domínio
- **Coesão**: Tudo relacionado a accounts fica junto
- **Facilita navegação**: Você sabe exatamente onde encontrar código do accounts
- **Manutenção**: Mudanças em accounts ficam isoladas no domínio

### Versionamento Interno
- **latest/**: Contém a implementação atual
- **v1/**: Faz re-export do latest, permitindo sobrescrever métodos específicos
- **Evolução**: Facilita criação de novas versões sem quebrar compatibilidade

### Escalabilidade
- **Padrão**: Outros domínios podem seguir a mesma estrutura
- **Isolamento**: Cada domínio evolui independentemente
- **Organização**: Estrutura clara para novos desenvolvedores

## Imports Atualizados

### Antes (Estrutura Antiga)
```typescript
import * as accountService from '@/services/v1/account.service';
import * as accountController from '@/controllers/v1/account.controller';
```

### Depois (Estrutura DDD)
```typescript
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import * as accountController from '@/domains/realms/accounts/v1/account.controller';
```

## Arquivos Migrados

### Removidos (Estrutura Antiga)
- `src/controllers/latest/account.controller.ts`
- `src/controllers/v1/account.controller.ts`
- `src/services/latest/account.service.ts`
- `src/services/v1/account.service.ts`
- `src/schemas/latest/account.schema.ts`
- `src/schemas/v1/account.schema.ts`
- `src/models/db/realms/accounts/`
- `tests/integration/routes/realm/v1/accounts/`

### Criados (Estrutura DDD)
- `src/domains/realms/accounts/latest/account.*`
- `src/domains/realms/accounts/v1/account.*`
- `tests/integration/domains/realms/accounts/v1/*.test.ts`

## Compatibilidade

### Sem Breaking Changes
- **Rotas**: Permanecem inalteradas (`/api/realm/:tenantId/v1/accounts`)
- **APIs**: Mesma interface pública
- **Testes**: Todos continuam passando

### Imports Atualizados
- **Rotas**: `src/routes/api/realm/v1/accounts.routes.ts`
- **Services**: `src/services/latest/auth.service.ts`, `src/services/latest/validation.service.ts`
- **Testes**: Todos os testes que importavam account service

## Próximos Passos

### Outros Domínios para Migrar
- `groups` → `src/domains/realms/groups/`
- `roles` → `src/domains/realms/roles/`
- `policies` → `src/domains/realms/policies/`

### Domínios Auth e Core
- `auth` → `src/domains/auth/`
- `config` → `src/domains/core/config/`
- `realm` → `src/domains/core/realm/`

## Padrão para Futuras Migrações

1. **Criar estrutura**: `src/domains/{contexto}/{dominio}/latest/`
2. **Mover arquivos**: Para a pasta `latest/` com nomes corretos
3. **Criar v1**: Fazer re-export do `latest/`
4. **Atualizar imports**: Em rotas, services e testes
5. **Remover antigos**: Arquivos da estrutura por tipo
6. **Testar**: Garantir que tudo funciona

## Conclusão

A migração do accounts foi concluída com sucesso, estabelecendo o padrão DDD para o projeto. A nova estrutura oferece melhor organização, facilita manutenção e permite evolução controlada através do versionamento interno.