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

#### Arquivos que fazem re-export simples:
- ✅ `{dominio}.controller.ts`
- ✅ `{dominio}.service.ts`
- ✅ `{dominio}.model.ts`
- ✅ `{dominio}.schema.ts`

```typescript
// ✅ Correto - v1 fazendo re-export simples
export * from '@/domains/realms/accounts/latest/account.service';

// ✅ Correto - sobrescrevendo método específico
export * from '@/domains/realms/accounts/latest/account.service';
export const create = customCreateMethod;
```

#### Arquivo que NÃO faz re-export simples:
- ❌ `{dominio}.routes.ts` - **Tem estrutura própria (veja seção Rotas)**

## Rotas (MagicRouter)

### Estrutura das Rotas no Latest
- Use `MagicRouter` para definir rotas
- Defina validações Zod para todos os endpoints
- Organize por tags do domínio
- Inclua responses de erro específicos
- Prefix deve ser o nome do recurso (ex: `/accounts`, `/realms`)

```typescript
// ✅ Correto - latest/{dominio}.routes.ts
import { MagicRouter } from '@/utils/core/MagicRouter';
import * as accountController from './account.controller';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  
  router.addRoute({
    name: 'createAccount',
    method: 'post',
    path: '/',
    handlers: [accountController.create],
    request: {
      body: {
        content: {
          'application/json': {
            schema: accountCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account created successfully',
        content: {
          'application/json': {
            schema: accountResponseSchema,
          },
        },
      },
    },
    tags: ['Accounts'],
  });
  
  return router;
};
```

### Estrutura das Rotas no V1
- **CRÍTICO: v1/{dominio}.routes.ts NÃO segue o padrão de re-export**
- **NUNCA use `export * from` em arquivos .routes.ts do v1**
- V1 cria um novo router com prefix `/v1`
- Importa e usa o router do latest dentro dele
- Isso adiciona versionamento à URL

```typescript
// ✅ Correto - v1/{dominio}.routes.ts
import * as accounts from '@/domains/realms/accounts/latest/accounts.routes';
import { MagicRouter } from '@/utils/core/MagicRouter';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const accountsRouter = await accounts.initialize();
  router.useMagic(accountsRouter);

  return router;
};
```

### Resultado Final das URLs
- Latest: `/api/{contexto}/{dominio}/{endpoint}`
- V1: `/api/{contexto}/v1/{dominio}/{endpoint}`
- Exemplo: `/api/realm/:tenantId/v1/accounts/` para criar account

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