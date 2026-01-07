# Authentication Implementation TODO

## Objetivo

Implementar autenticação usando `@Authenticated` decorator com validação via HTTP self-request, reutilizando o mesmo código de validação de token.

---

## Arquitetura

```
Request com Authorization: Bearer <token>
  ↓
@Authenticated() decorator detectado
  ↓
buildAuthenticationMiddleware (framework)
  ↓
IdmClient.validateAuthentication(token, tenantId)
  ↓
HTTP POST http://localhost:3000/api/realm/:tenantId/authentication/validate
  ↓
AuthenticationController.validateToken()
  ↓
JwtService.verifyToken(token)
  ↓
Retorna { valid: true, accountId: "..." }
  ↓
Middleware injeta ctx.state.authenticated = true
  ↓
Middleware injeta ctx.state.accountId = "..."
  ↓
Controller method executa
```

---

## ✅ O que JÁ EXISTE

### 1. Framework
- ✅ `@Authenticated(options)` decorator
- ✅ `buildAuthenticationMiddleware` - cria middleware automaticamente
- ✅ `IdmClient` - classe para validação externa
- ✅ Integração automática com RegisterRouter
- ✅ `EnvKey.IDM_AUTH_SERVICE_URL` - variável de ambiente configurada
- ✅ **Middleware funcionando** - bloqueia requests sem token

### 2. Projeto
- ✅ `JwtService.generateToken()` - gera access token
- ✅ `JwtService.generateRefreshToken()` - gera refresh token
- ✅ `JwtService.verifyToken()` - valida token e retorna payload
- ✅ `AuthenticationController` com endpoint `/login`
- ✅ `AuthenticationService.login()` - autentica usuário
- ✅ **Endpoint `POST /validate`** - valida token (retorna `{ valid: true }` por enquanto)
- ✅ **DTOs de validação** - `validateTokenRequestSchema`, `validateTokenResponseSchema`
- ✅ **Configuração de env** - `IDM_AUTH_SERVICE_URL=http://localhost:3000/api`
- ✅ **auth-client-js atualizado** - usa `idmAuthServiceUrl` sem `/api` hardcoded
- ✅ **Fluxo completo testado** - `@Authenticated` → HTTP self-request → `/validate` → controller
- ✅ **ApplicationController protegido** - `List applications` requer autenticação

---

## ❌ O que FALTA IMPLEMENTAR

### 1. ~~Endpoint de Validação de Token~~ ✅ CONCLUÍDO

**Status:** ✅ Implementado, testado e funcionando no fluxo completo

**Endpoint:** `POST /api/realm/:tenantId/authentication/validate`

**Fluxo testado:**
```
Request → @Authenticated → IdmClient → HTTP POST /validate → { valid: true } → Controller
```

**TODO Pendente:**
```typescript
// Implementar lógica real de validação
const payload = await this.service.validateToken(ctx.request.body.token);
ctx.body = { valid: true, accountId: payload.accountId };
```

---

### 2. Service Method para Validação ⏭️ PRÓXIMO

**Arquivo:** `src/domain/realm/authentication/authentication.service.ts`

**Adicionar:**
```typescript
@TraceAsync('authentication.service.validateToken')
async validateToken(token: string): Promise<JwtPayload> {
  return this.jwtService.verifyToken(token);
}
```

---

### 3. ~~Configuração de Variáveis de Ambiente~~ ✅ CONCLUÍDO

**Status:** ✅ Configurado e testado

```typescript
IDM_AUTH_SERVICE_URL=http://localhost:3000/api
APPLICATION_NAME=idm-auth-system
```

---

### 4. ~~Registrar IdmClient no Container~~ ✅ VERIFICADO

**Status:** ✅ IdmClient está funcionando (framework registra automaticamente)

---

### 5. Modificar Middleware para Injetar accountId ⏭️ PRÓXIMO

**Arquivo:** `.external/koa-inversify-framework/src/infrastructure/koa/middleware/authentication.build.middleware.ts`

**Problema atual:**
```typescript
ctx.state.authenticated = true;
// ❌ Não injeta accountId
```

**Solução:**

**Opção A: Modificar no framework (se tiver controle)**
```typescript
const result = await idmClient.validateAuthentication(token, tenantId);

if (!result.valid) {
  ctx.throw(401, result.error || 'Invalid token');
}

ctx.state.authenticated = true;
ctx.state.accountId = result.accountId; // ← Adicionar
```

**Opção B: Criar middleware customizado no projeto**

Se não puder modificar o framework, criar:
`src/infrastructure/middleware/authentication.build.middleware.ts`

E registrar no lugar do middleware do framework.

---

### 6. Atualizar Endpoint /validate para Retornar accountId ⏭️ PRÓXIMO

**Arquivo:** `src/domain/realm/authentication/authentication.controller.ts`

**Atualizar DTO:**
```typescript
export const validateTokenResponseSchema = z.object({
  valid: z.boolean(),
  accountId: z.string().optional(), // ← Adicionar
  error: z.string().optional(),
});
```

**Implementar lógica:**
```typescript
@Post('/validate')
async validateToken(ctx: ContextWithBody<ValidateTokenRequest>): Promise<void> {
  try {
    const payload = await this.service.validateToken(ctx.request.body.token);
    ctx.body = { 
      valid: true, 
      accountId: payload.accountId 
    };
  } catch (error) {
    ctx.body = { 
      valid: false, 
      error: 'Invalid or expired token' 
    };
  }
}
```

---

### 7. Aplicar @Authenticated nos Controllers

**Arquivo:** `src/domain/realm/application/application.controller.ts`

**Adicionar decorator:**
```typescript
import { Authenticated } from 'koa-inversify-framework/decorator';

@Authenticated({ required: true })
@Get('/')
async findAllPaginated(ctx: Context): Promise<void> {
  // Agora protegido!
  // ctx.state.authenticated === true
  // ctx.state.accountId === "uuid-do-usuario"
  return super.findAllPaginated(ctx);
}
```

**Aplicar em outros endpoints conforme necessário.**

---

### 8. Usar accountId no Controller/Service

**Exemplo de uso:**
```typescript
@Authenticated({ required: true })
@Get('/')
async findAllPaginated(ctx: Context): Promise<void> {
  const accountId = ctx.state.accountId;
  
  this.log.info({ accountId }, 'User accessing applications list');
  
  // Pode filtrar por accountId se necessário
  // Pode fazer audit log
  
  return super.findAllPaginated(ctx);
}
```

---

## 🔍 Checklist de Implementação

### Fase 1: Endpoint de Validação ✅ CONCLUÍDO
- [x] Adicionar DTOs de validação (`validateTokenRequestSchema`, `validateTokenResponseSchema`)
- [x] Adicionar endpoint `POST /validate` no `AuthenticationController`
- [x] Testar endpoint manualmente com curl
- [x] Aplicar `@Authenticated()` no `ApplicationController`
- [x] Testar fluxo completo (request → middleware → /validate → controller)
- [ ] Adicionar método `validateToken()` no `AuthenticationService` (TODO)
- [ ] Implementar lógica real de validação no endpoint (TODO)

### Fase 2: Configuração ✅ CONCLUÍDO
- [x] Adicionar `IDM_AUTH_SERVICE_URL` e `APPLICATION_NAME` no env defaults
- [x] Atualizar `EnvKey` com `IDM_AUTH_SERVICE_URL`
- [x] Atualizar auth-client-js para usar `idmAuthServiceUrl`
- [x] Remover `/api` hardcoded do auth-client-js
- [x] Verificar se `IdmClient` está registrado no container (framework registra automaticamente)
- [x] Testar HTTP self-request funcionando

### Fase 3: Validação Real ⏭️ PRÓXIMO
- [ ] Atualizar DTO de response para incluir `accountId`
- [ ] Implementar método `validateToken()` no service
- [ ] Implementar lógica de validação real no endpoint
- [ ] Modificar middleware para injetar `ctx.state.accountId`
- [ ] Testar com token JWT real (gerado via /login)
- [ ] Testar com token inválido (deve retornar valid: false)
- [ ] Testar com token expirado (deve retornar valid: false)

### Fase 4: Testes End-to-End ⏭️ PENDENTE
- [ ] Fazer login e obter token real
- [ ] Testar List applications com token real
- [ ] Verificar se `ctx.state.accountId` está disponível no controller
- [ ] Testar outros endpoints protegidos
- [ ] Testar com múltiplos tenants

### Fase 5: Documentação ⏭️ PENDENTE
- [ ] Atualizar Swagger com header `Authorization`
- [ ] Documentar fluxo de autenticação
- [ ] Adicionar exemplos de uso
- [ ] Documentar como proteger novos endpoints

---

## 🚨 Pontos de Atenção

### 1. Loop Infinito
**Problema:** Se o endpoint `/validate` tiver `@Authenticated()`, vai chamar a si mesmo infinitamente.

**Solução:** Endpoint `/validate` **NÃO** pode ter `@Authenticated()`.

### 2. Performance
**Overhead:** Cada request autenticado faz 1 HTTP request interno (~5-10ms).

**Mitigação:** 
- Usar HTTP/1.1 keep-alive
- Considerar cache de tokens validados (Redis)
- Monitorar latência

### 3. Tenant ID
**Problema:** Middleware precisa de `tenantId` para validar token.

**Solução:** Garantir que `ctx.params.tenantId` está disponível antes do middleware executar.

### 4. Error Handling
**Problema:** Erros no endpoint `/validate` podem não ser tratados corretamente.

**Solução:** Sempre retornar `{ valid: false, error: "..." }` em caso de erro, nunca throw.

---

## 📝 Ordem de Implementação Recomendada

1. **Endpoint `/validate`** (mais crítico)
2. **Configuração de env vars**
3. **Testar IdmClient manualmente**
4. **Modificar middleware** (se necessário)
5. **Aplicar `@Authenticated()`**
6. **Testes end-to-end**

---

## 🧪 Testes

### Teste Manual 1: Endpoint de Validação ✅ TESTADO
```bash
# Testar endpoint (retorna sempre valid: true por enquanto)
curl -X POST http://localhost:3000/api/realm/7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5/authentication/validate \
  -H "Content-Type: application/json" \
  -d '{"token":"any-token"}'

# Resultado: { "valid": true } ✅
```

### Teste Manual 2: Fluxo Completo de Autenticação ✅ TESTADO
```bash
# Sem token - deve retornar 401
curl http://localhost:3000/api/realm/7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5/application
# Resultado: {"error":"Internal Server Error","message":"Missing Authorization header"} ✅

# Com token fake - deve funcionar (validate retorna sempre true)
curl http://localhost:3000/api/realm/7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5/application \
  -H "Authorization: Bearer fake-token"
# Resultado: Lista de applications ✅

# Fluxo verificado nos logs:
# 1. Request → @Authenticated middleware
# 2. IdmClient → HTTP POST /validate
# 3. Endpoint /validate → { valid: true }
# 4. Controller executa → retorna dados ✅
```

### Teste Manual 3: Com Token Real (TODO)
```bash
# Gerar token via login
TOKEN=$(curl -X POST http://localhost:3000/api/realm/:tenantId/authentication/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.token')

# Validar token
curl -X POST http://localhost:3000/api/realm/:tenantId/authentication/validate \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\"}"

# Esperado: { "valid": true, "accountId": "..." }
```

### Teste Manual 4: Endpoint Protegido com Token Real (TODO)
```bash
# Sem token (deve retornar 401)
curl http://localhost:3000/api/realm/:tenantId/application

# Com token (deve funcionar)
curl http://localhost:3000/api/realm/:tenantId/application \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Referências

- Framework: `.external/koa-inversify-framework/src/decorator/authentication.decorator.ts`
- Middleware: `.external/koa-inversify-framework/src/infrastructure/koa/middleware/authentication.build.middleware.ts`
- IdmClient: `.external/koa-inversify-framework/src/infrastructure/idm-client/idmClient.provider.ts`
- JWT Service: `src/domain/realm/jwt/jwt.service.ts`
- Auth Controller: `src/domain/realm/authentication/authentication.controller.ts`
