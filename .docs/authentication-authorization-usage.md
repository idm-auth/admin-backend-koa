# Authentication & Authorization - Guia de Uso

## Visão Geral

Sistema de autenticação e autorização integrado ao MagicRouter com suporte a múltiplos métodos de autenticação e autorização baseada em policies.

## Status Atual

- ✅ **MagicRouter**: Suporte completo para `authentication` e `authorization`
- ✅ **Validação**: Authorization obrigatório quando authentication definido
- ✅ **Authentication Middleware**: Estrutura pronta (implementação pendente)
- ⏳ **Authorization Middleware**: STUB - apenas passa requisições (implementação futura)

## Estrutura

### Authentication Config

```typescript
authentication?: {
  jwt?: boolean;      // Autenticação via JWT Bearer token
  apiKey?: boolean;   // Autenticação via API Key
}
```

**Lógica:** Qualquer método válido autentica (OR logic)

### Authorization Config

```typescript
authorization?: {
  action: string;      // Ex: 'iam:accounts:delete'
  resource?: string;   // Ex: 'grn:global:iam::${tenantId}:accounts/${id}'
}
```

**Obrigatório:** Se `authentication` definido, `authorization` é obrigatório

## Exemplos de Uso

### Rota Pública (Sem Autenticação)

```typescript
router.post({
  name: 'login',
  path: '/login',
  summary: 'User login',
  handlers: [authenticationController.login],
  request: {
    params: requestTenantIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: loginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: loginResponseSchema,
        },
      },
    },
  },
  tags: ['Authentication'],
});
```

### Rota Autenticada (JWT)

```typescript
router.get({
  name: 'listAccounts',
  path: '/',
  summary: 'List all accounts',
  authentication: { 
    jwt: true  // ← Requer JWT
  },
  authorization: {
    action: 'iam:accounts:read',
    resource: 'grn:global:iam::${tenantId}:accounts/*'
  },
  handlers: [accountController.findAll],
  request: {
    params: requestTenantIdParamsSchema,
    query: paginationQuerySchema,
  },
  responses: {
    200: {
      description: 'Accounts retrieved successfully',
      content: {
        'application/json': {
          schema: accountListResponseSchema,
        },
      },
    },
  },
  tags: ['Accounts'],
});
```

### Rota com Múltiplos Métodos de Autenticação

```typescript
router.delete({
  name: 'deleteAccount',
  path: '/{id}',
  summary: 'Delete account',
  authentication: { 
    jwt: true,      // ← Aceita JWT
    apiKey: true    // ← OU API Key
  },
  authorization: {
    action: 'iam:accounts:delete',
    resource: 'grn:global:iam::${tenantId}:accounts/${id}'
  },
  handlers: [accountController.remove],
  request: {
    params: z.object({
      tenantId: z.string(),
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'Account deleted successfully',
    },
  },
  tags: ['Accounts'],
});
```

### Rota com Autorização Granular

```typescript
router.post({
  name: 'createGroup',
  path: '/',
  summary: 'Create group',
  authentication: { 
    jwt: true 
  },
  authorization: {
    action: 'iam:groups:create',
    resource: 'grn:global:iam::${tenantId}:groups/*'
  },
  handlers: [groupController.create],
  request: {
    params: requestTenantIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: groupCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Group created successfully',
      content: {
        'application/json': {
          schema: groupResponseSchema,
        },
      },
    },
  },
  tags: ['Groups'],
});
```

## Fluxo de Middlewares

```
Request
  ↓
requestValidation (Zod schemas)
  ↓
authentication (JWT OU apiKey) ← Popula ctx.user
  ↓
authorization (Policy Engine) ← Avalia policies
  ↓
middlewares customizados
  ↓
handlers
  ↓
responseValidation
  ↓
Response
```

## Variáveis Dinâmicas no Resource

O campo `resource` suporta variáveis que são substituídas em runtime:

- `${tenantId}` - Tenant ID do contexto
- `${accountId}` - Account ID autenticado
- `${id}` - ID do recurso (de params)
- Qualquer param da rota

**Exemplo:**
```typescript
authorization: {
  action: 'iam:accounts:update',
  resource: 'grn:global:iam::${tenantId}:accounts/${id}'
}

// Com tenantId='company-xyz' e id='user-123':
// → 'grn:global:iam::company-xyz:accounts/user-123'
```

## Erros

### 401 Unauthorized
Lançado quando autenticação falha para todos os métodos configurados.

### 403 Forbidden
Lançado quando usuário está autenticado mas não tem permissão (authorization falha).

### Validation Error
Lançado em build time se `authentication` definido sem `authorization`.

```typescript
// ❌ ERRO: Vai lançar erro na validação
router.get({
  name: 'invalid',
  path: '/invalid',
  authentication: { jwt: true },
  // Falta authorization!
  handlers: [controller.invalid],
});

// Error: Route 'invalid' has authentication but missing authorization
```

## Implementação Pendente

### Authentication Middleware
- [ ] Implementar `tryJwtAuth` - validação de JWT tokens
- [ ] Implementar `tryApiKeyAuth` - validação de API Keys
- [ ] Adicionar `ctx.user` com dados do usuário autenticado
- [ ] Type augmentation para `Context` com `user`

### Authorization Middleware
- [ ] Implementar Policy Engine
- [ ] Buscar policies do user (account-policies, group-policies, role-policies)
- [ ] Substituir variáveis dinâmicas no resource
- [ ] Avaliar policies (Deny > Allow > Deny implícito)
- [ ] Suporte a wildcards em actions e resources
- [ ] Cache de policies para performance

## Próximos Passos

1. Implementar JWT authentication
2. Implementar Policy Engine básico
3. Adicionar testes para authentication/authorization
4. Documentar formato de JWT payload
5. Criar utilitários para geração de tokens
6. Implementar cache de policies
7. Adicionar rate limiting
8. Implementar logs de auditoria

## Referências

- [Sistema de Permissões](./permissions-system.md)
- [MagicRouter](./magic-router.md)
- [Errors](../src/errors/)
