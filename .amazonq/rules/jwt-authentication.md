# JWT Authentication - IA Rules

## TRIGGERS AUTOMÁTICOS - AUTENTICAÇÃO

### SE rota precisa autenticação
→ **ENTÃO** adicione `authentication: { jwt: true }` na configuração MagicRouter

### SE rota é pública (login, signup)
→ **ENTÃO** NUNCA adicione authentication, deixe sem a propriedade

### SE precisa acessar usuário autenticado
→ **ENTÃO** use `ctx.state.user.accountId` e `ctx.state.tenantId`

### SE gerando token JWT
→ **ENTÃO** use `jwtService.generateToken(tenantId, payload)`

### SE verificando token JWT
→ **ENTÃO** NUNCA faça manualmente, middleware faz automaticamente

## AÇÕES OBRIGATÓRIAS

### Proteger rota com JWT
```typescript
router.get({
  name: 'listAccounts',
  path: '/',
  summary: 'List all accounts',
  handlers: [accountController.findAllPaginated],
  authentication: {
    jwt: true,
  },
  request: {
    params: requestTenantIdParamsSchema,
  },
  responses: swagger.listPaginated.responses,
  tags: ['Accounts'],
});
```

### Acessar usuário autenticado no controller
```typescript
export const findAllPaginated = async (ctx: Context) => {
  return withSpanAsync({
    name: `${CONTROLLER_NAME}.findAllPaginated`,
    attributes: { operation: 'findAllPaginated', 'http.method': 'GET' },
  }, async () => {
    // Dados do usuário autenticado (populado pelo middleware)
    const authenticatedAccountId = ctx.state.user.accountId;
    const authenticatedTenantId = ctx.state.tenantId;
    
    // Dados da requisição
    const { tenantId } = ctx.validated.params;
    const query = ctx.validated.query;
    
    // Lógica do controller
  });
};
```

### Gerar token JWT (após login)
```typescript
import * as jwtService from '@/domains/realms/jwt/jwt.service';

export const login = async (tenantId: string, credentials: LoginCredentials) => {
  // Validar credenciais
  const account = await validateCredentials(tenantId, credentials);
  
  // Gerar token
  const token = await jwtService.generateToken(tenantId, {
    accountId: account._id,
    email: account.emails[0].email,
  });
  
  return { token, account };
};
```

## GUARDRAILS OBRIGATÓRIOS

### Middleware automático
- **NUNCA** implemente verificação JWT manualmente
- **SEMPRE** use `authentication: { jwt: true }` no MagicRouter
- **Middleware popula** `ctx.state.user` e `ctx.state.tenantId` automaticamente

### Token no header
- **Formato obrigatório**: `Authorization: Bearer <token>`
- **Middleware extrai** automaticamente do header
- **Erro 401** se token ausente, inválido ou expirado

### Payload JWT
- **accountId**: ID da conta autenticada (obrigatório)
- **email**: Email da conta (obrigatório)
- **Validação**: Schema Zod `jwtPayloadSchema`

### Secret e expiração
- **Secret**: Armazenado em `realm.jwtConfig.secret`
- **Expiração**: Configurado em `realm.jwtConfig.expiresIn`
- **Por tenant**: Cada realm tem seu próprio secret

## PADRÕES DE RECONHECIMENTO

### Rota protegida quando vejo:
- `authentication: { jwt: true }` na configuração
- Controller acessa `ctx.state.user.accountId`
- Documentação Swagger mostra security requirement

### Rota pública quando vejo:
- Sem propriedade `authentication`
- Rotas de login, signup, health check
- Documentação Swagger sem security

### Token válido quando:
- Header `Authorization: Bearer <token>` presente
- Token assinado com secret correto do realm
- Token não expirado
- Payload contém accountId e email válidos

## FLUXO COMPLETO

### 1. Login (gerar token)
```typescript
// Controller
export const login = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const credentials = ctx.validated.body;
  
  const result = await authService.login(tenantId, credentials);
  
  ctx.status = 200;
  ctx.body = result; // { token, account }
};

// Service
export const login = async (tenantId: string, credentials: LoginCredentials) => {
  const account = await validateCredentials(tenantId, credentials);
  
  const token = await jwtService.generateToken(tenantId, {
    accountId: account._id,
    email: account.emails[0].email,
  });
  
  return { token, account };
};
```

### 2. Requisição autenticada
```bash
curl -X GET http://localhost:3000/api/realm/{tenantId}/accounts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Middleware processa
- Extrai token do header
- Verifica com `jwtService.verifyToken(tenantId, token)`
- Popula `ctx.state.user` e `ctx.state.tenantId`
- Passa para o próximo middleware/handler

### 4. Controller usa dados
```typescript
export const findById = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;
  const authenticatedAccountId = ctx.state.user.accountId;
  
  // Pode validar se usuário tem permissão para acessar o recurso
  const account = await accountService.findById(tenantId, id);
  
  ctx.status = 200;
  ctx.body = mapper.toReadResponse(account);
};
```

## ERROS COMUNS

### 401 Unauthorized
- Token ausente no header
- Token inválido (assinatura incorreta)
- Token expirado
- Formato do header incorreto

### 403 Forbidden
- Token válido mas sem permissão para o recurso
- Implementado via authorization middleware (futuro)

## REGRA DE OURO

**"Rota protegida = authentication: { jwt: true }. Middleware faz tudo automaticamente."**

**"NUNCA implemente verificação JWT manualmente. Use o middleware."**
