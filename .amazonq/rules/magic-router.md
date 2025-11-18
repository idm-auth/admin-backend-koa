# MagicRouter Rules

## Uso Obrigatório
- **SEMPRE use MagicRouter** em vez de Router tradicional do Koa
- Substitua `new Router()` por `new MagicRouter()`
- Use métodos HTTP específicos: `router.get()`, `router.post()`, etc.

## Estrutura de Rotas

### Configuração Básica
```typescript
import { MagicRouter } from '@/utils/core/MagicRouter';

const router = new MagicRouter({ prefix: '/accounts' });
```

### Definição de Rotas
```typescript
router.post({
  name: 'createAccount',           // Nome único da rota
  path: '/',                       // Path da rota
  summary: 'Create account',       // Descrição da rota
  handlers: [controller.create],   // Array de handlers
  request: {                       // Validações de entrada
    params: paramsSchema,
    body: {
      content: {
        'application/json': {
          schema: createSchema,
        },
      },
    },
  },
  responses: {                     // Validações de saída
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },
  },
  tags: ['Accounts'],             // Tags para documentação
});
```

## Validações Obrigatórias

### Request (Entrada)
- **params**: Para parâmetros de URL (/:id)
- **query**: Para query parameters (?email=...)
- **body**: Para dados do corpo (POST/PUT)

### Responses (Saída)
- **responses**: Objeto com códigos de status e schemas
- Sempre incluir pelo menos 200/201 e códigos de erro

### Exemplo Completo
```typescript
// Schemas de validação
const accountCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const accountResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Definição da rota
router.post({
  name: 'createAccount',
  path: '/',
  summary: 'Create account',
  handlers: [accountController.create],
  request: {
    params: requestTenantIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: accountCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Account created successfully',
      content: {
        'application/json': {
          schema: accountResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
  tags: ['Accounts'],
});
```

## Padrões por Método HTTP

### POST (Criação)
```typescript
router.post({
  name: 'create{Entity}',
  path: '/',
  summary: 'Create {entity}',
  handlers: [controller.create],
  request: {
    params: requestTenantIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: createSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '{Entity} created successfully',
      content: {
        'application/json': {
          schema: entityResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
  tags: ['{Entity}'],
});
```

### GET por ID
```typescript
router.get({
  name: 'get{Entity}ById',
  path: '/:id',
  summary: 'Get {entity} by ID',
  handlers: [controller.findById],
  request: {
    params: requestTenantIdAndIdParamsSchema,
  },
  responses: {
    200: {
      description: '{Entity} found',
      content: {
        'application/json': {
          schema: entityResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: '{Entity} not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
  tags: ['{Entity}'],
});
```

### GET com Query (Lista)
```typescript
router.get({
  name: 'list{Entity}',
  path: '/',
  summary: 'List all {entity} with pagination',
  handlers: [controller.findAllPaginated],
  request: {
    params: requestTenantIdParamsSchema,
    query: paginationQuerySchema,
  },
  responses: {
    200: {
      description: '{Entity} list',
      content: {
        'application/json': {
          schema: entityListResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
  tags: ['{Entity}'],
});
```

### PUT (Atualização)
```typescript
router.put({
  name: 'update{Entity}',
  path: '/:id',
  summary: 'Update {entity}',
  handlers: [controller.update],
  request: {
    params: requestTenantIdAndIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: updateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '{Entity} updated successfully',
      content: {
        'application/json': {
          schema: entityResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: '{Entity} not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
  tags: ['{Entity}'],
});
```

### DELETE
```typescript
router.delete({
  name: 'remove{Entity}',
  path: '/:id',
  summary: 'Remove {entity}',
  handlers: [controller.remove],
  request: {
    params: requestTenantIdAndIdParamsSchema,
  },
  responses: {
    204: {
      description: '{Entity} removed successfully',
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: '{Entity} not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
  tags: ['{Entity}'],
});
```

## Composição de Routers

### useMagic() - Composição de Routers
- Use `router.useMagic(childRouter)` para compor routers
- Permite hierarquia de routers com prefixos

```typescript
// Router pai
const parentRouter = new MagicRouter({ prefix: '/v1' });

// Router filho
const childRouter = await accounts.initialize(); // MagicRouter com prefix '/accounts'

// Composição
parentRouter.useMagic(childRouter);
// Resultado: /v1/accounts/*
```

## Schemas Reutilizáveis

### Schemas Base
```typescript
import { publicUUIDSchema } from '@/domains/commons/base/latest/base.schema';
import { requestTenantIdParamsSchema, requestTenantIdAndIdParamsSchema } from '@/domains/commons/base/request.schema';

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});
```

### Schemas de Domínio
- Defina schemas específicos no arquivo `{dominio}.schema.ts`
- Reutilize schemas base quando possível
- Use `createCrudSwagger()` para gerar schemas CRUD padrão

## Tags e Organização

### Nomenclatura de Tags
- Use o nome do domínio em PascalCase
- Exemplos: `['Accounts']`, `['Groups']`, `['Roles']`

### Nomenclatura de Rotas
- Use padrão: `{action}{Entity}`
- Exemplos: `createAccount`, `getAccountById`, `listAccounts`

### Summary Obrigatório
- Sempre inclua `summary` para documentação
- Use descrições claras e concisas
- Exemplo: `'Create account'`, `'Get account by ID'`

## Funcionalidades Avançadas

### Middlewares Personalizados
```typescript
router.post({
  name: 'protectedRoute',
  path: '/protected',
  middlewares: [authMiddleware, rateLimitMiddleware],
  handlers: [controller.protectedAction],
  // ... resto da configuração
});
```

### Conversão Automática de Paths
- MagicRouter converte automaticamente paths OpenAPI para Koa
- `{param}` → `:param`
- Permite usar sintaxe OpenAPI padrão

## Benefícios

### Validação Automática
- Zod valida automaticamente requests e responses
- Middleware de validação integrado
- Type safety em runtime
- Erros de validação padronizados

### Documentação OpenAPI
- Swagger gerado automaticamente
- Schemas documentados
- Exemplos de request/response
- Integração com `@asteasolutions/zod-to-openapi`

### Padronização
- Estrutura consistente em todas as rotas
- Tratamento de erro padronizado
- Facilita manutenção e evolução
- Composição hierárquica de routers