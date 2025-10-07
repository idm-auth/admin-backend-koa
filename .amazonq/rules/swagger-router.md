# SwaggerRouter Rules

## Uso Obrigatório
- **SEMPRE use SwaggerRouter** em vez de Router tradicional do Koa
- Substitua `new Router()` por `new SwaggerRouter()`
- Substitua `router.post()` por `router.addRoute()`

## Estrutura de Rotas

### Configuração Básica
```typescript
import { SwaggerRouter } from '@/utils/swagger-router';

const router = new SwaggerRouter({ prefix: '/accounts' });
```

### Definição de Rotas
```typescript
router.addRoute({
  name: 'createAccount',           // Nome único da rota
  method: 'post',                  // Método HTTP
  path: '/',                       // Path da rota
  handlers: [controller.create],   // Array de handlers
  validate: {                      // Validações Zod
    body: createSchema,
    response: responseSchema,
    responses: {
      400: errorSchema,
      404: errorSchema,
    },
  },
  tags: ['Accounts'],             // Tags para documentação
});
```

## Validações Obrigatórias

### Schemas de Entrada
- **body**: Para POST/PUT requests
- **params**: Para parâmetros de URL (/:id)
- **query**: Para query parameters (?email=...)

### Schemas de Saída
- **response**: Schema principal de retorno (200/201)
- **responses**: Schemas para códigos de erro específicos

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

## Padrões por Método HTTP

### POST (Criação)
```typescript
router.addRoute({
  name: 'create{Entity}',
  method: 'post',
  path: '/',
  validate: {
    body: createSchema,
    response: entityResponseSchema,
    responses: { 400: errorResponseSchema },
  },
  tags: ['{Entity}'],
});
```

### GET por ID
```typescript
router.addRoute({
  name: 'get{Entity}ById',
  method: 'get',
  path: '/:id',
  validate: {
    params: z.object({ id: DocIdSchema }),
    response: entityResponseSchema,
    responses: { 400: errorResponseSchema, 404: errorResponseSchema },
  },
  tags: ['{Entity}'],
});
```

### GET com Query
```typescript
router.addRoute({
  name: 'search{Entity}',
  method: 'get',
  path: '/search',
  validate: {
    query: searchQuerySchema,
    response: entityResponseSchema,
    responses: { 400: errorResponseSchema, 404: errorResponseSchema },
  },
  tags: ['{Entity}'],
});
```

### PUT (Atualização)
```typescript
router.addRoute({
  name: 'update{Entity}',
  method: 'put',
  path: '/:id',
  validate: {
    params: z.object({ id: DocIdSchema }),
    body: updateSchema,
    response: entityResponseSchema,
    responses: { 400: errorResponseSchema, 404: errorResponseSchema },
  },
  tags: ['{Entity}'],
});
```

### DELETE
```typescript
router.addRoute({
  name: 'remove{Entity}',
  method: 'delete',
  path: '/:id',
  validate: {
    params: z.object({ id: DocIdSchema }),
    responses: { 400: errorResponseSchema, 404: errorResponseSchema },
  },
  tags: ['{Entity}'],
});
```

## Schemas Reutilizáveis

### Schemas Base
```typescript
import { emailSchema, DocIdSchema } from '@/schemas/latest/base.schema';

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

const paramsWithIdSchema = z.object({
  id: DocIdSchema,
});
```

### Schemas de Domínio
- Defina schemas específicos no arquivo `{dominio}.schema.ts`
- Reutilize schemas base quando possível
- Combine schemas para validações complexas

## Tags e Organização

### Nomenclatura de Tags
- Use o nome do domínio em PascalCase
- Exemplos: `['Accounts']`, `['Groups']`, `['Roles']`

### Nomenclatura de Rotas
- Use padrão: `{action}{Entity}`
- Exemplos: `createAccount`, `getUserById`, `searchGroups`

## Benefícios

### Validação Automática
- Zod valida automaticamente requests e responses
- Erros de validação são tratados automaticamente
- Type safety em runtime

### Documentação
- Swagger gerado automaticamente
- Schemas documentados
- Exemplos de request/response

### Padronização
- Estrutura consistente em todas as rotas
- Tratamento de erro padronizado
- Facilita manutenção e evolução