# JWT Authentication - Implementação

## Visão Geral

Sistema de autenticação JWT integrado ao MagicRouter, permitindo proteger rotas com validação automática de tokens.

## Status

✅ **Implementado e Funcional**

## Componentes

### 1. Authentication Middleware
**Arquivo:** `src/middlewares/authentication.middleware.ts`

Middleware que valida tokens JWT e popula `ctx.user` com dados do usuário autenticado.

### 2. Type Augmentation
**Arquivo:** `src/types/koa.d.ts`

Adiciona `user` ao Context do Koa com type safety.

```typescript
import { DocId } from '@/domains/commons/base/base.schema';

interface Context {
  user?: {
    accountId: DocId;
    email: string;
    tenantId: DocId;
  };
}
```

## Fluxo de Autenticação

```
Request com Authorization: Bearer <token>
  ↓
extractBearerToken(ctx)
  ↓
jwtService.verifyToken(tenantId, token)
  ↓
ctx.user = { accountId, email, tenantId }
  ↓
next() → Rota protegida
```

## Como Usar

### Proteger uma Rota

```typescript
router.get({
  name: 'listAccounts',
  path: '/',
  summary: 'List all accounts',
  authentication: { 
    jwt: true  // ← Ativa validação JWT
  },
  authorization: {
    action: 'iam:accounts:read',
    resource: 'grn:global:iam::${tenantId}:accounts/*'
  },
  handlers: [accountController.findAll],
  // ...
});
```

### Acessar Dados do Usuário no Controller

```typescript
export const findAll = async (ctx: Context) => {
  // ctx.user está disponível após autenticação
  const { accountId, email, tenantId } = ctx.user!;
  
  const logger = await getLogger();
  logger.info(
    { accountId, email, tenantId },
    'User accessing accounts list'
  );
  
  // Lógica do controller
};
```

## Formato do Token

### Header da Requisição
```
Authorization: Bearer <jwt-token>
```

### Payload do JWT
```json
{
  "accountId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Geração do Token
O token é gerado no login via `jwtService.generateToken()`:

```typescript
const token = await jwtService.generateToken(tenantId, {
  accountId: account._id,
  email: args.email,
});
```

## Validação

### 1. Header Authorization
- Deve estar presente
- Formato: `Bearer <token>`
- Token não pode estar vazio

### 2. Tenant ID
- Extraído de `ctx.validated.params.tenantId` ou `ctx.params.tenantId`
- Obrigatório para validar o token

### 3. Token JWT
- Verificado usando secret do realm
- Validação de expiração automática
- Payload deve conter `accountId` e `email`

## Erros

### 401 Unauthorized

**Authorization header missing**
```json
{
  "error": "Unauthorized",
  "message": "Authorization header missing"
}
```

**Invalid authorization header format**
```json
{
  "error": "Unauthorized",
  "message": "Invalid authorization header format"
}
```

**Token missing in authorization header**
```json
{
  "error": "Unauthorized",
  "message": "Token missing in authorization header"
}
```

**Tenant ID not found in request**
```json
{
  "error": "Unauthorized",
  "message": "Tenant ID not found in request"
}
```

**Token expired or invalid**
```json
{
  "error": "Unauthorized",
  "message": "jwt expired"
}
```

## Telemetria

### Spans OpenTelemetry

**authentication.middleware.authenticate**
- Atributos: `auth.methods`, `auth.success`

**authentication.middleware.tryJwtAuth**
- Atributos: `auth.method`, `tenant.id`, `account.id`, `account.email`

### Logs Estruturados

```json
{
  "level": "debug",
  "tenantId": "company-xyz",
  "accountId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "msg": "JWT authentication successful"
}
```

## Exemplo Completo

### 1. Login (Obter Token)

```bash
curl -X POST http://localhost:3000/api/realm/company-xyz/authentication/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "account": {
    "_id": "550e8400-e29b-41d4-a716-446655440000",
    "emails": [
      {
        "email": "admin@example.com",
        "isPrimary": true
      }
    ]
  }
}
```

### 2. Acessar Rota Protegida

```bash
curl -X GET http://localhost:3000/api/realm/company-xyz/accounts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (sucesso):**
```json
{
  "data": [...],
  "pagination": {...}
}
```

**Response (sem token):**
```json
{
  "error": "Unauthorized",
  "message": "Authorization header missing"
}
```

## Múltiplos Métodos de Autenticação

O middleware suporta múltiplos métodos (OR logic):

```typescript
authentication: { 
  jwt: true,      // Tenta JWT primeiro
  apiKey: true    // Se JWT falhar, tenta API Key
}
```

Atualmente apenas JWT está implementado. API Key será implementado futuramente.

## Segurança

### Secret do JWT
- Armazenado no realm (`realm.jwtConfig.secret`)
- Único por tenant
- Nunca exposto nas APIs

### Expiração
- Configurável por realm (`realm.jwtConfig.expiresIn`)
- Validação automática pelo jsonwebtoken
- Token expirado retorna 401

### Isolamento Multi-Tenant
- Token validado com secret do tenant específico
- Token de um tenant não funciona em outro
- `tenantId` obrigatório na validação

## Próximos Passos

- [ ] Implementar API Key authentication
- [ ] Adicionar refresh tokens
- [ ] Implementar rate limiting
- [ ] Adicionar logs de auditoria
- [ ] Cache de validações
- [ ] Blacklist de tokens revogados

## Referências

- [JWT Service](../src/domains/realms/jwt/jwt.service.ts)
- [Authentication Service](../src/domains/realms/authentication/authentication.service.ts)
- [Authentication Middleware](../src/middlewares/authentication.middleware.ts)
- [Authentication & Authorization Usage](./authentication-authorization-usage.md)
