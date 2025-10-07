# Arquitetura DDD (Domain-Driven Design)

## Estrutura de Domínios

### Organização por Contexto de Negócio
- **realms/**: Conteúdo multi-tenant (accounts, groups, roles, policies)
- **auth/**: Autenticação e autorização (login, tokens, passwords)
- **core/**: Funcionalidades centrais (config, realm management)

### Estrutura Interna dos Domínios
```
src/domains/{contexto}/{dominio}/
├── latest/
│   ├── {dominio}.controller.ts
│   ├── {dominio}.service.ts
│   ├── {dominio}.model.ts
│   ├── {dominio}.schema.ts
│   └── {dominio}.routes.ts
└── v1/
    ├── {dominio}.controller.ts (re-export do latest)
    ├── {dominio}.service.ts (re-export do latest)
    ├── {dominio}.model.ts (re-export do latest)
    ├── {dominio}.schema.ts (re-export do latest)
    └── {dominio}.routes.ts (re-export do latest)
```

## Versionamento

### Latest (Implementação Atual)
- Contém a implementação mais recente
- Todos os arquivos com funcionalidade completa
- Imports diretos entre arquivos do mesmo domínio

### V1 (Compatibilidade)
- Faz re-export do latest por padrão
- Permite sobrescrever métodos específicos quando necessário
- Mantém compatibilidade com código existente

```typescript
// ✅ Correto - v1 fazendo re-export
export * from '@/domains/realms/accounts/latest/account.service';

// ✅ Correto - sobrescrevendo método específico
export * from '@/domains/realms/accounts/latest/account.service';
export const create = customCreateMethod;
```

## Rotas (SwaggerRouter)

### Estrutura das Rotas
- Use `SwaggerRouter` em vez de Router tradicional
- Defina validações Zod para todos os endpoints
- Organize por tags do domínio
- Inclua responses de erro específicos

```typescript
// ✅ Correto - SwaggerRouter com validação
const router = new SwaggerRouter({ prefix: '/accounts' });

router.addRoute({
  name: 'createAccount',
  method: 'post',
  path: '/',
  handlers: [accountController.create],
  validate: {
    body: accountCreateSchema,
    response: accountResponseSchema,
    responses: {
      400: errorResponseSchema,
    },
  },
  tags: ['Accounts'],
});
```

### Schemas de Validação
- **Body**: Para dados de entrada (POST/PUT)
- **Params**: Para parâmetros de URL (/:id)
- **Query**: Para query parameters (?email=...)
- **Response**: Para estrutura de retorno
- **Responses**: Para diferentes códigos de erro

## Testes

### Estrutura de Testes
```
tests/integration/domains/{contexto}/{dominio}/
└── v1/
    ├── post.test.ts
    ├── get.id.test.ts
    └── get.search.test.ts
```

### Imports nos Testes
- Sempre importe da versão v1 do domínio
- Use imports diretos, não re-exports de estruturas antigas

```typescript
// ✅ Correto
import * as accountService from '@/domains/realms/accounts/v1/account.service';

// ❌ Incorreto
import * as accountService from '@/services/v1/account.service';
```

## Imports e Exports

### Imports Internos do Domínio
- Dentro do latest: imports relativos ou absolutos para o mesmo domínio
- Entre domínios: sempre use paths absolutos

```typescript
// ✅ Correto - dentro do mesmo domínio (latest)
import * as accountService from './account.service';

// ✅ Correto - entre domínios
import * as groupService from '@/domains/realms/groups/v1/group.service';
```

### Re-exports de Compatibilidade
- Estruturas antigas fazem re-export dos domínios
- Permite migração gradual sem breaking changes

```typescript
// ✅ Correto - arquivo antigo apontando para novo
export * from '@/domains/realms/accounts/v1/account.controller';
```

## Benefícios

### Organização
- **Coesão**: Tudo relacionado ao domínio fica junto
- **Navegação**: Fácil localizar funcionalidades
- **Manutenção**: Mudanças isoladas por domínio

### Escalabilidade
- **Novos domínios**: Seguem o mesmo padrão
- **Evolução**: Versionamento interno permite mudanças controladas
- **Isolamento**: Domínios evoluem independentemente

### Compatibilidade
- **Sem breaking changes**: Re-exports mantêm compatibilidade
- **Migração gradual**: Permite mover domínios um por vez
- **Flexibilidade**: Sobrescrever apenas o necessário