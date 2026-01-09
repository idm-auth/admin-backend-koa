# TODO: Sistema de Autorização IAM

## Status Atual

### ✅ Já Implementado
- [x] Modelo de dados completo (Policy, Role, Account, relacionamentos)
- [x] Biblioteca `auth-client-js` com função `authorize()`
- [x] `IdmClient` no framework com método `authorize()`
- [x] Decorator `@Authorize` (estrutura básica)
- [x] Middleware builder `buildAuthorize` (estrutura vazia - TODO dentro)
- [x] Sistema de autenticação funcionando (`@Authenticated`)

### ❌ Faltando Implementar

---

## 1. Backend IDM - Endpoint de Autorização

### 1.0 Renomear módulo `authentication` para `auth`
**Motivação:** Padronizar nomenclatura com `authz` (authorization) e seguir padrão da indústria

**Arquivos a renomear:**
- [ ] `src/domain/realm/authentication/` → `src/domain/realm/auth/`
- [ ] `authentication.controller.ts` → `auth.controller.ts`
- [ ] `authentication.service.ts` → `auth.service.ts`
- [ ] `authentication.dto.ts` → `auth.dto.ts`
- [ ] `authentication.mapper.ts` → `auth.mapper.ts`
- [ ] `authentication.module.ts` → `auth.module.ts`

**Atualizar imports:**
- [ ] Buscar todos os imports de `authentication` e atualizar para `auth`
- [ ] Atualizar exports em `src/domain/realm/index.ts`
- [ ] Atualizar referências em testes

**Atualizar rotas:**
- [ ] Basepath: `/api/realm/:tenantId/authentication` → `/api/realm/:tenantId/auth`

**Símbolos DI:**
- [ ] `AuthenticationControllerSymbol` → `AuthControllerSymbol`
- [ ] `AuthenticationServiceSymbol` → `AuthServiceSymbol`
- [ ] `AuthenticationMapperSymbol` → `AuthMapperSymbol`
- [ ] `AuthenticationModuleSymbol` → `AuthModuleSymbol`

### 1.1 Criar módulo `authorization` (ou `authz`) em `src/domain/realm/`
### 1.1 Criar módulo `authz` em `src/domain/realm/`
**Arquivos a criar:**
- [ ] `authz/authz.controller.ts` - Endpoint `/authz/evaluate`
- [ ] `authz/authz.service.ts` - Lógica de avaliação de policies
- [ ] `authz/authz.dto.ts` - DTOs de request/response
- [ ] `authz/authz.mapper.ts` - Mappers (se necessário)
- [ ] `authz/authz.module.ts` - Módulo DI

**Responsabilidades:**
- Receber request: `{ accountId, action, resource, partition?, region? }`
- Buscar policies do account (via account-roles, account-policies, account-groups, group-roles, group-policies, role-policies)
- Avaliar policies: **Deny explícito > Allow explícito > Deny implícito**
- Retornar: `{ allowed: boolean, error?: string, payload?: {...} }`

### 1.2 Implementar Policy Engine
**Arquivo:** `authz/authz.service.ts`

**Funções necessárias:**
- [ ] `getPoliciesForAccount(accountId, tenantId)` - Buscar todas as policies aplicáveis
  - Buscar via: account-policies, account-roles → role-policies, account-groups → group-roles → role-policies, account-groups → group-policies
  - Retornar array único de policies (sem duplicatas)
- [ ] `evaluatePolicies(policies, action, resource)` - Avaliar regras
- [ ] `matchAction(policyAction, requestAction)` - Match com wildcards
  - Suportar: `idm-auth-core-api:accounts:*`, `idm-auth-core-api:*:read`, `*:*:*`
  - Match exato ou wildcard em qualquer posição
- [ ] `matchResource(policyResource, requestResource)` - Match GRN com wildcards
  - Suportar: `grn:*:idm-auth-core-api::tenant:accounts/*`, `grn:global:*:*:tenant:*`
  - Match exato ou wildcard em qualquer parte do GRN
- [ ] `resolveVariables(template, context)` - Resolver `${tenantId}`, `${accountId}`, etc.
  - Substituir variáveis nas policies antes de fazer match
  - Exemplo: `grn:global:idm-auth-core-api::${tenantId}:accounts/${accountId}` → `grn:global:idm-auth-core-api::company-xyz:accounts/user-123`

**Lógica de avaliação:**
```typescript
1. Buscar todas as policies do account (via relacionamentos)
2. Resolver variáveis nas policies (${tenantId}, ${accountId})
3. Filtrar policies que fazem match com action + resource
4. Se existe Deny explícito → DENY
5. Se existe Allow explícito → ALLOW
6. Caso contrário → DENY (implícito)
```

**Referência do /old:**
- `/old/src/middlewares/authorization.middleware.ts` - Função `buildGRN()` mostra como construir GRN
- `/old/.docs/permissions-system.md` - Documentação completa do sistema de policies

### 1.3 Criar rota pública
**Arquivo:** `authz/authz.controller.ts`

```typescript
@Controller({ basePath: '/api/realm/:tenantId/authz', multiTenant: true })
export class AuthorizationController {
  @Post('/evaluate')
  // NÃO usar @Authenticated aqui - é endpoint público usado pelo próprio sistema
  async evaluate(ctx: Context): Promise<void> {
    // Validar X-IDM-Application header
    // Chamar service.evaluate()
    // Retornar { allowed: boolean }
  }
}
```

**IMPORTANTE:** 
- Este endpoint NÃO deve ter `@Authenticated`, pois é usado pelo próprio sistema de autenticação
- Deve validar header `X-IDM-Application` para garantir que apenas aplicações autorizadas podem chamar
- Deve ser rota pública mas com validação de origem

---

## 2. Framework - Middleware de Autorização

### 2.1 Implementar `buildAuthorize` middleware
**Arquivo:** `.external/koa-inversify-framework/src/infrastructure/koa/middleware/authorize.build.middleware.ts`

**Referência do /old:** `/old/src/middlewares/authorization.middleware.ts`

**Implementação:**
```typescript
function authorizeMiddleware(options: AuthorizeOptions, idmClient: IdmClient): KoaMiddleware {
  return async (ctx: Context, next: Next) => {
    // 1. Extrair accountId e tenantId do ctx.state (populado por @Authenticated)
    const accountId = ctx.state.accountId;
    const tenantId = ctx.params?.tenantId;
    
    if (!accountId || !tenantId) {
      throw new UnauthorizedError('User not authenticated');
    }
    
    // 2. Resolver templates de action e resource
    const action = resolveTemplate(options.action, ctx);
    const resource = resolveTemplate(options.resource, ctx);
    
    // 3. Chamar idmClient.authorize()
    const result = await idmClient.authorize(
      accountId,
      tenantId,
      action,
      resource,
      options.partition,
      options.region
    );
    
    // 4. Se !allowed → throw ForbiddenError
    if (!result.allowed) {
      throw new ForbiddenError(result.error || 'Access denied');
    }
    
    // 5. Se allowed → await next()
    await next();
  };
}

// Resolve templates: ${tenantId}, ${id}, ${accountId}, etc.
function resolveTemplate(template: string, ctx: Context): string {
  return template.replace(/\${(\w+)}/g, (_, key) => {
    // Prioridade: params > state > vazio
    return ctx.params?.[key] || ctx.state?.[key] || '';
  });
}
```

**Tarefas:**
- [ ] Implementar função `resolveTemplate(template, ctx)` (ver exemplo acima)
- [ ] Extrair `accountId` de `ctx.state.accountId` (populado por @Authenticated)
- [ ] Extrair `tenantId` de `ctx.params.tenantId`
- [ ] Chamar `idmClient.authorize()` com todos os parâmetros
- [ ] Tratar erros e lançar `ForbiddenError` quando !allowed
- [ ] Adicionar logs de debug
- [ ] Validar que accountId e tenantId existem antes de chamar authorize

### 2.2 Atualizar decorators `@AuthorizeResource` e `@Authorize`
**Arquivo:** `.external/koa-inversify-framework/src/decorator/authorize.decorator.ts`

**Criar dois decorators:**

```typescript
// Decorator de classe - define sistema, resource base, partition e region
export interface AuthorizeResourceOptions {
  system: string;      // Nome do sistema/aplicação: "idm-auth-core-api"
  resource: string;    // Recurso base: "accounts", "policies", etc.
  partition?: string;  // Opcional: "global" (default), "gov", "mil"
  region?: string;     // Opcional: "" (vazio/global), "americas", "europe", "asia"
}

export function AuthorizeResource(options: AuthorizeResourceOptions) {
  return function (target: Function) {
    Reflect.defineMetadata('authorize:resource', options, target.prototype);
  };
}

// Decorator de método - define apenas a operação
export function Authorize(operation: string) {
  return function (target: object, propertyKey: string) {
    Reflect.defineMetadata('authorize:operation', operation, target, propertyKey);
  };
}

// Helper para obter metadados completos
export function getAuthorizeMetadata(targetClass: object, methodName: string) {
  const resourceOptions = Reflect.getMetadata('authorize:resource', targetClass);
  const operation = Reflect.getMetadata('authorize:operation', targetClass, methodName);
  
  if (!resourceOptions || !operation) return null;
  
  return {
    action: `${resourceOptions.system}:${resourceOptions.resource}:${operation}`,
    system: resourceOptions.system,
    partition: resourceOptions.partition || 'global',
    region: resourceOptions.region || '',
  };
}
```

**Construção do GRN pelo middleware:**
- Action: `${system}:${resource}:${operation}` (ex: `idm-auth-core-api:accounts:list`)
- GRN: `grn:${partition}:${system}:${region}:${tenantId}:${fullPath}`
- Exemplo: `grn:global:idm-auth-core-api::tenant-123:/api/realm/tenant-123/accounts/acc-456`

**Extração dos valores:**
- `partition` → do decorator (default: 'global')
- `system` → do decorator
- `region` → do decorator (default: '')
- `tenantId` → de `ctx.params.tenantId`
- `fullPath` → de `ctx.path` (path completo da requisição)
  - Request: `GET /api/realm/tenant-123/accounts/acc-456`
  - fullPath: `/api/realm/tenant-123/accounts/acc-456` ✅

**Tarefas:**
- [ ] Criar decorator `@AuthorizeResource` para classe (system + resource + partition + region)
- [ ] Atualizar decorator `@Authorize` para aceitar apenas string (operation)
- [ ] Implementar `getAuthorizeMetadata()` que combina metadados
- [ ] Middleware constrói GRN: `grn:${partition}:${system}:${region}:${tenantId}:${ctx.path}`
- [ ] Remover campos antigos (`roles`, `operation` object, `app`)
- [ ] Atualizar testes

### 2.3 Registrar middleware no pipeline
**Arquivo:** `.external/koa-inversify-framework/src/infrastructure/koa/router/router.builder.ts`

**Verificar se `buildAuthorize` está registrado na ordem correta:**
```typescript
// Ordem correta:
1. buildExecutionContextMiddleware
2. buildAuthenticationMiddleware  // Popula ctx.state.accountId
3. buildAuthorize                 // Usa ctx.state.accountId
4. buildZodValidateRequestMiddleware
5. buildInjectCoreTenantIdMiddleware
```

---

## 3. Backend IDM - Aplicar Autorização nos Controllers

### 3.1 Definir actions para cada recurso
**Criar arquivo:** `src/domain/realm/authz/actions.constants.ts`

**Referência do /old:** `/old/.docs/permissions-system.md` - Seção "Padrões de Nomenclatura"

```typescript
// Formato: {sistema}:{recurso}:{operação}
// Sistema: idm-auth-core-api (este sistema)
// Recurso: accounts, policies, roles, groups, etc.
// Operação: create, read, update, delete, list

export const IDM_ACTIONS = {
  ACCOUNTS: {
    CREATE: 'idm-auth-core-api:accounts:create',
    READ: 'idm-auth-core-api:accounts:read',
    UPDATE: 'idm-auth-core-api:accounts:update',
    DELETE: 'idm-auth-core-api:accounts:delete',
    LIST: 'idm-auth-core-api:accounts:list',
  },
  POLICIES: {
    CREATE: 'idm-auth-core-api:policies:create',
    READ: 'idm-auth-core-api:policies:read',
    UPDATE: 'idm-auth-core-api:policies:update',
    DELETE: 'idm-auth-core-api:policies:delete',
    LIST: 'idm-auth-core-api:policies:list',
  },
  ROLES: {
    CREATE: 'idm-auth-core-api:roles:create',
    READ: 'idm-auth-core-api:roles:read',
    UPDATE: 'idm-auth-core-api:roles:update',
    DELETE: 'idm-auth-core-api:roles:delete',
    LIST: 'idm-auth-core-api:roles:list',
  },
  GROUPS: {
    CREATE: 'idm-auth-core-api:groups:create',
    READ: 'idm-auth-core-api:groups:read',
    UPDATE: 'idm-auth-core-api:groups:update',
    DELETE: 'idm-auth-core-api:groups:delete',
    LIST: 'idm-auth-core-api:groups:list',
  },
  // Relacionamentos
  ACCOUNT_ROLES: {
    CREATE: 'idm-auth-core-api:account-roles:create',
    READ: 'idm-auth-core-api:account-roles:read',
    DELETE: 'idm-auth-core-api:account-roles:delete',
    LIST: 'idm-auth-core-api:account-roles:list',
  },
  // ... outros recursos
} as const;
```

### 3.2 Aplicar `@Authorize` nos controllers
**Exemplo:** `src/domain/realm/account/account.controller.ts`

```typescript
@AuthorizeResource({ 
  system: 'idm-auth-core-api', 
  resource: 'accounts',
  partition: 'global',  // Opcional, default: 'global'
  region: ''            // Opcional, default: '' (vazio = recurso global)
})
@Controller({ basePath: '/api/realm/:tenantId/accounts', multiTenant: true })
export class AccountController extends AbstractController {
  
  @Get('/')
  @Authenticated()
  @Authorize('list')
  async findAll(ctx: Context): Promise<void> {
    return super.findAllPaginated(ctx);
  }

  @Get('/:id')
  @Authenticated()
  @Authorize('read')
  async findById(ctx: Context): Promise<void> {
    return super.findById(ctx);
  }

  @Post('/')
  @Authenticated()
  @Authorize('create')
  async create(ctx: Context): Promise<void> {
    return super.create(ctx);
  }

  @Put('/:id')
  @Authenticated()
  @Authorize('update')
  async update(ctx: Context): Promise<void> {
    return super.update(ctx);
  }

  @Delete('/:id')
  @Authenticated()
  @Authorize('delete')
  async delete(ctx: Context): Promise<void> {
    return super.delete(ctx);
  }
}
```

**Aplicar em todos os controllers:**
- [ ] `account.controller.ts`
- [ ] `policy.controller.ts`
- [ ] `role.controller.ts`
- [ ] `group.controller.ts`
- [ ] `account-role.controller.ts`
- [ ] `account-policy.controller.ts`
- [ ] `account-group.controller.ts`
- [ ] `group-role.controller.ts`
- [ ] `group-policy.controller.ts`
- [ ] `role-policy.controller.ts`
- [ ] `application.controller.ts`
- [ ] `application-action.controller.ts`
- [ ] `application-configuration.controller.ts`

**EXCEÇÕES (rotas públicas - não aplicar autorização):**
- [ ] `auth.controller.ts` - Login, refresh, assume-role (rotas públicas)
- [ ] `authz.controller.ts` - Endpoint `/authz/evaluate` (usado internamente)
- [ ] `system-setup.controller.ts` - Setup inicial do sistema (verificar se precisa proteção)

**NOTA:** No /old, o MagicRouter tinha suporte nativo para `authentication` e `authorization` na config da rota. No novo sistema com decorators, isso é feito via `@Authenticated()` e `@Authorize()`.

---

## 4. Testes

### 4.1 Testes Unitários - Policy Engine
**Arquivo:** `test/unit/domain/realm/authorization/authorization.service.test.ts`

**Cenários:**
- [ ] Deny explícito tem precedência sobre Allow
- [ ] Allow explícito permite acesso
- [ ] Deny implícito quando nenhuma policy match
- [ ] Wildcards em actions: `idm-auth-core-api:*:read`, `*:accounts:*`
- [ ] Wildcards em resources: `grn:*:idm-auth-core-api::tenant:accounts/*`
- [ ] Resolução de variáveis: `${tenantId}`, `${accountId}`
- [ ] Match de recursos hierárquicos

### 4.2 Testes Unitários - Middleware
**Arquivo:** `.external/koa-inversify-framework/test/unit/infrastructure/koa/middleware/authorize.build.middleware.test.ts`

**Cenários:**
- [ ] Middleware extrai accountId do ctx.state
- [ ] Middleware resolve templates corretamente
- [ ] Middleware chama idmClient.authorize()
- [ ] Middleware lança ForbiddenError quando !allowed
- [ ] Middleware chama next() quando allowed

### 4.3 Testes de Integração - Endpoint
**Arquivo:** `test/integration/domain/realm/authz/evaluate.test.ts`

**Cenários:**
- [ ] POST /authz/evaluate retorna allowed=true para policy válida
- [ ] POST /authz/evaluate retorna allowed=false quando sem permissão
- [ ] POST /authz/evaluate valida X-IDM-Application header
- [ ] POST /authz/evaluate retorna 400 para request inválido

### 4.4 Testes de Integração - Controllers com Autorização
**Arquivo:** `test/integration/domain/realm/account/account.authorization.test.ts`

**Cenários:**
- [ ] GET /accounts retorna 403 sem permissão `idm-auth-core-api:accounts:list`
- [ ] GET /accounts retorna 200 com permissão `idm-auth-core-api:accounts:list`
- [ ] POST /accounts retorna 403 sem permissão `idm-auth-core-api:accounts:create`
- [ ] DELETE /accounts/:id retorna 403 com Deny explícito

---

## 5. Documentação

### 5.1 Atualizar documentação do framework
**Arquivo:** `.external/koa-inversify-framework/.doc/auth-integration.md`

**Adicionar:**
- [ ] Exemplos de uso do `@Authorize`
- [ ] Como definir actions e resources
- [ ] Como usar templates (`${tenantId}`, `${id}`)
- [ ] Ordem dos middlewares

### 5.2 Criar guia de uso
**Arquivo:** `docs/authorization-guide.md`

**Conteúdo:**
- [ ] Como criar policies
- [ ] Como associar policies a roles
- [ ] Como associar roles a accounts
- [ ] Exemplos de policies comuns (Admin, ReadOnly, Self-Service)
- [ ] Como testar autorização

### 5.3 Atualizar README
**Arquivo:** `README.md`

**Adicionar:**
- [ ] Seção sobre autorização
- [ ] Link para guia de uso
- [ ] Exemplos rápidos

---

## 6. Dados de Teste / Seed

### 6.1 Criar policies padrão
**Arquivo:** `scripts/seed-policies.ts`

**Policies a criar:**
- [ ] `AdminFullAccess` - `*:*:*` em `grn:*:*:*:${tenantId}:*`
- [ ] `IDMFullAccess` - `idm-auth-core-api:*:*` em `grn:global:idm-auth-core-api::${tenantId}:*`
- [ ] `ReadOnlyAccess` - `*:*:read` e `*:*:list` em `grn:*:*:*:${tenantId}:*`
- [ ] `SelfManagement` - `idm-auth-core-api:accounts:read` e `idm-auth-core-api:accounts:update` em `grn:global:idm-auth-core-api::${tenantId}:accounts/${accountId}`

### 6.2 Criar roles padrão
**Arquivo:** `scripts/seed-roles.ts`

**Roles a criar:**
- [ ] `Administrator` - Associar `AdminFullAccess`
- [ ] `IDM Administrator` - Associar `IDMFullAccess`
- [ ] `Auditor` - Associar `ReadOnlyAccess`
- [ ] `User` - Associar `SelfManagement`

---

## 7. Otimizações (Futuro)

### 7.1 Cache de Policies
- [ ] Implementar cache em memória para policies por account
- [ ] Invalidar cache quando policies/roles mudam
- [ ] Configurar TTL do cache

### 7.2 Performance
- [ ] Adicionar índices no MongoDB para queries de policies
- [ ] Otimizar query de busca de policies (joins)
- [ ] Medir performance do endpoint `/authz/evaluate`

### 7.3 Auditoria
- [ ] Logar todas as decisões de autorização
- [ ] Criar tabela de audit log
- [ ] Dashboard de acessos negados

---

## Ordem de Implementação Recomendada

### Sprint 0: Refatoração de Nomenclatura
0. Renomear `authentication` para `auth` (1.0)

### Sprint 1: Backend IDM - Core
1. Criar módulo `authz` (1.1)
2. Implementar Policy Engine (1.2)
3. Criar endpoint `/authz/evaluate` (1.3)
4. Testes unitários do Policy Engine (4.1)
5. Testes de integração do endpoint (4.3)

### Sprint 2: Framework - Middleware
6. Atualizar decorator `@Authorize` (2.2)
7. Implementar middleware `buildAuthorize` (2.1)
8. Verificar ordem dos middlewares (2.3)
9. Testes unitários do middleware (4.2)

### Sprint 3: Backend IDM - Aplicação
10. Definir actions constants (3.1)
11. Aplicar `@Authorize` em todos os controllers (3.2)
12. Testes de integração dos controllers (4.4)

### Sprint 4: Dados e Documentação
13. Criar policies padrão (6.1)
14. Criar roles padrão (6.2)
15. Atualizar documentação (5.1, 5.2, 5.3)

### Sprint 5: Otimizações (Opcional)
16. Implementar cache (7.1)
17. Otimizar performance (7.2)
18. Adicionar auditoria (7.3)

---

## Checklist Final

Antes de considerar completo:
- [ ] Todos os endpoints protegidos têm `@Authorize`
- [ ] Endpoint `/authz/evaluate` funciona corretamente
- [ ] Middleware de autorização funciona no framework
- [ ] Testes passando (unitários + integração)
- [ ] Documentação atualizada
- [ ] Policies e roles padrão criados
- [ ] Sistema testado end-to-end com usuário real

---

## 8. Migração do /old (Referências Úteis)

### 8.1 Código de Referência
**Arquivos úteis do /old:**
- `/old/src/middlewares/authorization.middleware.ts` - Função `buildGRN()` e estrutura do middleware
- `/old/src/utils/core/MagicRouter.ts` - Como authentication/authorization eram integrados nas rotas
- `/old/.docs/permissions-system.md` - Documentação completa do sistema IAM
- `/old/.docs/authentication-authorization-usage.md` - Exemplos de uso
- `/old/.docs/magic-router.md` - Como rotas eram configuradas

### 8.2 Diferenças Arquiteturais

**Sistema Antigo (/old):**
- MagicRouter com config inline: `authentication: { jwt: true }`, `authorization: { action, resource }`
- Middlewares aplicados automaticamente pelo MagicRouter
- Validação em build-time se authentication sem authorization

**Sistema Novo (atual):**
- Decorators: `@Authenticated()`, `@Authorize({ action, resource })`
- Middlewares construídos pelo framework via builders
- Validação em runtime pelo middleware

### 8.3 Conceitos Mantidos
**O que permanece igual:**
- Formato de action: `{sistema}:{recurso}:{operação}`
- Formato de resource (GRN): `grn:partition:sistema:region:tenantId:resource-path`
- Lógica de avaliação: Deny > Allow > Deny implícito
- Resolução de templates: `${tenantId}`, `${id}`, `${accountId}`
- Wildcards em actions e resources

**O que mudou:**
- Sintaxe: config object → decorators
- Aplicação: MagicRouter → middleware builders
- Validação: build-time → runtime

### 8.4 Exemplo de Migração

**Antes (/old - MagicRouter):**
```typescript
router.get({
  name: 'listAccounts',
  path: '/',
  authentication: { jwt: true },
  authorization: {
    action: 'idm-auth-core-api:accounts:list'
  },
  handlers: [controller.findAll],
  // ... rest of config
});
```

**Depois (novo - Decorators):**
```typescript
@Controller({ basePath: '/api/realm/:tenantId/accounts', multiTenant: true })
export class AccountController {
  @Get('/')
  @Authenticated()
  @Authorize('list')
  async findAll(ctx: Context): Promise<void> {
    return super.findAllPaginated(ctx);
  }
}
```

---

## Notas Importantes

### Segurança
- Endpoint `/authz/evaluate` é público mas valida `X-IDM-Application` header
- Nunca expor detalhes internos de policies em mensagens de erro
- Sempre usar HTTPS em produção

### Performance
- Policy evaluation deve ser rápido (<50ms)
- Considerar cache após implementação básica funcionar
- Monitorar queries de busca de policies

### Manutenibilidade
- Manter actions constants centralizados
- Documentar formato de GRN em cada controller
- Usar templates consistentes (`${tenantId}`, `${id}`)
