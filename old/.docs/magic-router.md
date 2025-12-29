# MagicRouter - Enhanced Koa Router

O MagicRouter é uma extensão do Koa Router que integra automaticamente validação Zod e geração de documentação OpenAPI/Swagger.

## Visão Geral

### Funcionalidades Principais
- **Validação automática** de requests e responses com Zod
- **Geração automática** de documentação OpenAPI/Swagger
- **Type safety** em runtime e compile time
- **Composição hierárquica** de routers
- **Middleware integrado** para validação

### Diferenças do Koa Router Tradicional
- Substitui `router.post(path, handler)` por `router.post(config)`
- Integra validação Zod diretamente na definição da rota
- Gera documentação OpenAPI automaticamente
- Converte sintaxe OpenAPI `{param}` para Koa `:param`

## Instalação e Uso Básico

### Import
```typescript
import { MagicRouter } from '@/utils/core/MagicRouter';
```

### Criação do Router
```typescript
const router = new MagicRouter({ prefix: '/accounts' });
```

### Definição de Rotas
```typescript
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

## Configuração de Rotas

### Propriedades Obrigatórias
- **name**: Identificador único da rota
- **path**: Caminho da rota (sintaxe OpenAPI)
- **handlers**: Array de handlers Koa
- **responses**: Definição de respostas por código de status
- **tags**: Tags para organização na documentação

### Propriedades Opcionais
- **summary**: Descrição breve da rota
- **middlewares**: Middlewares específicos da rota
- **request**: Validações de entrada (params, query, body)

## Validação de Requests

### Parâmetros de URL
```typescript
import { DocIdSchema } from '@/domains/commons/base/base.schema';

request: {
  params: z.object({
    tenantId: DocIdSchema,
    id: DocIdSchema,
  }),
}
```

### Query Parameters
```typescript
request: {
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(25),
    filter: z.string().optional(),
  }),
}
```

### Body (POST/PUT)
```typescript
request: {
  body: {
    content: {
      'application/json': {
        schema: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
    },
  },
}
```

## Validação de Responses

### Resposta de Sucesso
```typescript
import { DocIdSchema } from '@/domains/commons/base/base.schema';

responses: {
  200: {
    description: 'Success',
    content: {
      'application/json': {
        schema: z.object({
          id: DocIdSchema,
          email: z.string().email(),
          createdAt: z.string(),
        }),
      },
    },
  },
}
```

### Respostas de Erro
```typescript
responses: {
  400: {
    description: 'Bad request',
    content: {
      'application/json': {
        schema: z.object({
          error: z.string(),
          details: z.string().optional(),
        }),
      },
    },
  },
  404: {
    description: 'Not found',
    content: {
      'application/json': {
        schema: z.object({
          error: z.string(),
          details: z.string().optional(),
        }),
      },
    },
  },
}
```

## Métodos HTTP Disponíveis

### GET
```typescript
router.get({
  name: 'getAccount',
  path: '/:id',
  summary: 'Get account by ID',
  handlers: [controller.findById],
  // ... configuração
});
```

### POST
```typescript
router.post({
  name: 'createAccount',
  path: '/',
  summary: 'Create account',
  handlers: [controller.create],
  // ... configuração
});
```

### PUT
```typescript
router.put({
  name: 'updateAccount',
  path: '/:id',
  summary: 'Update account',
  handlers: [controller.update],
  // ... configuração
});
```

### PATCH
```typescript
router.patch({
  name: 'patchAccount',
  path: '/:id',
  summary: 'Partially update account',
  handlers: [controller.patch],
  // ... configuração
});
```

### DELETE
```typescript
router.delete({
  name: 'removeAccount',
  path: '/:id',
  summary: 'Remove account',
  handlers: [controller.remove],
  // ... configuração
});
```

## Composição de Routers

### useMagic() - Composição Simples
```typescript
const parentRouter = new MagicRouter({ prefix: '/v1' });
const childRouter = new MagicRouter({ prefix: '/accounts' });

// Compõe routers
parentRouter.useMagic(childRouter);
// Resultado: /v1/accounts/*
```

### Exemplo Prático - Versionamento
```typescript
// latest/accounts.routes.ts
export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  
  router.post({
    name: 'createAccount',
    path: '/',
    // ... configuração completa
  });
  
  return router;
};

// v1/accounts.routes.ts
import * as accounts from '@/domains/realms/accounts/latest/accounts.routes';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/v1' });
  const accountsRouter = await accounts.initialize();
  router.useMagic(accountsRouter);
  return router;
};
```

## Middlewares Personalizados

### Middleware Específico da Rota
```typescript
router.post({
  name: 'protectedRoute',
  path: '/protected',
  middlewares: [authMiddleware, rateLimitMiddleware],
  handlers: [controller.protectedAction],
  // ... resto da configuração
});
```

### Ordem de Execução
1. **Request Validation** (automático)
2. **Middlewares personalizados** (se definidos)
3. **Handlers** (exceto o último)
4. **Último handler** (wrapped para chamar next)
5. **Response Validation** (automático)

## Conversão Automática de Paths

### Sintaxe OpenAPI → Koa
- `{tenantId}` → `:tenantId`
- `{id}` → `:id`
- `/accounts/{id}/groups` → `/accounts/:id/groups`

### Exemplo
```typescript
// Definição (sintaxe OpenAPI)
path: '/accounts/{id}/groups/{groupId}'

// Registrado no Koa como
path: '/accounts/:id/groups/:groupId'
```

## Integração com OpenAPI

### Registro Automático
- Todas as rotas são automaticamente registradas no OpenAPI Registry
- Documentação Swagger gerada automaticamente
- Validação de schemas em desenvolvimento

### Validação de Schemas
```typescript
// Em desenvolvimento, valida schemas automaticamente
if (process.env.NODE_ENV === 'development') {
  // Testa se o schema é válido antes de registrar
  const testRegistry = new OpenAPIRegistry();
  testRegistry.registerPath(routeConfig);
}
```

## Acesso aos Dados Validados

### No Controller
```typescript
export const create = async (ctx: Context) => {
  // Dados já validados pelo middleware
  const { tenantId } = ctx.validated.params;
  const data = ctx.validated.body;
  const query = ctx.validated.query;
  
  const result = await service.create(tenantId, data);
  ctx.body = result;
};
```

### Propriedades Disponíveis
- `ctx.validated.params` - Parâmetros de URL
- `ctx.validated.query` - Query parameters
- `ctx.validated.body` - Corpo da requisição
- `ctx.validated.cookies` - Cookies validados

## Tratamento de Erros

### Erros de Validação
- Automaticamente capturados pelo middleware
- Retornados como 400 Bad Request
- Incluem detalhes específicos do erro Zod

### Erros de Negócio
```typescript
// No service
if (!account) {
  throw new NotFoundError('Account not found');
}

// Automaticamente convertido para 404 com schema de erro
```

## Schemas Reutilizáveis

### Schemas Base
```typescript
import { 
  publicUUIDSchema,
  requestTenantIdParamsSchema,
  requestTenantIdAndIdParamsSchema 
} from '@/domains/commons/base/latest/base.schema';

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});
```

### CRUD Helper
```typescript
import { createCrudSwagger } from '@/utils/crudSwagger.util';

const swagger = createCrudSwagger(
  'Account',
  accountCreateSchema,
  accountUpdateSchema,
  accountCreateResponseSchema,
  accountUpdateResponseSchema,
  accountReadResponseSchema,
  accountPaginatedResponseSchema
);

// Usa schemas pré-configurados
router.post({
  name: 'createAccount',
  path: '/',
  request: {
    body: swagger.create.request.body,
  },
  responses: swagger.create.responses,
  // ...
});
```

## Exemplo Completo

### Arquivo de Rotas Completo
```typescript
import { MagicRouter } from '@/utils/core/MagicRouter';
import { publicUUIDSchema } from '@/domains/commons/base/latest/base.schema';
import { z } from 'zod';
import * as controller from './account.controller';

// Import from commons/base
import { requestTenantIdParamsSchema } from '@/domains/commons/base/request.schema';

const requestTenantIdAndIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
  id: publicUUIDSchema,
});

const accountCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

import { DocIdSchema } from '@/domains/commons/base/base.schema';

const accountResponseSchema = z.object({
  id: DocIdSchema,
  email: z.string().email(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });

  // CREATE
  router.post({
    name: 'createAccount',
    path: '/',
    summary: 'Create account',
    handlers: [controller.create],
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

  // READ
  router.get({
    name: 'getAccountById',
    path: '/{id}',
    summary: 'Get account by ID',
    handlers: [controller.findById],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Account found',
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
      404: {
        description: 'Account not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Accounts'],
  });

  return router;
};
```

## Benefícios

### Para Desenvolvedores
- **Type Safety**: Validação em compile time e runtime
- **Produtividade**: Menos código boilerplate
- **Consistência**: Padrão único para todas as rotas
- **Debugging**: Erros claros e específicos

### Para APIs
- **Documentação**: Swagger automático e sempre atualizado
- **Validação**: Entrada e saída sempre validadas
- **Padronização**: Estrutura consistente de erros
- **Versionamento**: Composição hierárquica de routers

### Para Manutenção
- **Evolução**: Fácil adicionar novas validações
- **Refatoração**: Type safety previne quebras
- **Testing**: Schemas reutilizáveis em testes
- **Monitoramento**: Logs estruturados automáticos
