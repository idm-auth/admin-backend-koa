# Public Routes Pattern: Reutilizando Controllers Multi-Tenant

## Problema

Precisamos expor rotas públicas (sem `:tenantId` na URL) que internamente operam no **core realm** (tenant padrão), mas queremos **reutilizar os controllers multi-tenant existentes** sem fazer bypass da camada de controller.

### Por que não fazer bypass?

Controllers contêm decorators importantes que serão implementados:
- `@Audit` - Auditoria de operações
- `@Authentication` - Validação de autenticação
- `@Authorization` - Controle de acesso
- `@RateLimit` - Limitação de requisições
- `@Validation` - Validação de dados
- Outros decorators customizados

**Fazer bypass (Service → Service direto) pula todos esses decorators!**

---

## Soluções Consideradas

### ❌ Solução 1: Service Direto (Bypass)
```typescript
ConfigService → ApplicationConfigurationService → Repository
```
**Problema:** Pula o controller, perde todos os decorators.

### ❌ Solução 2: Controller → Controller
```typescript
ConfigController → ApplicationConfigurationController
```
**Problema:** Controllers não devem chamar outros controllers (anti-pattern).

### ❌ Solução 3: HTTP Internal Request
```typescript
ConfigController → fetch(localhost:port/api/realm/:tenantId/...) → Controller
```
**Problema:** Overhead de HTTP, complexidade desnecessária.

---

## ✅ Solução Adotada: Decorator @InjectCoreTenantId

### Conceito

Criar um **decorator** `@InjectCoreTenantId` que injeta automaticamente o `tenantId` do core realm no contexto, permitindo reutilizar controllers multi-tenant em rotas públicas.

### Arquitetura

```
GET /api/core/application-configuration/app/:appId/env/:env  (rota pública)
  ↓
CoreApplicationConfigurationController.getByApplicationAndEnvironment
  ↓
@InjectCoreTenantId() decorator
  ↓ (injeta ctx.params.tenantId = coreRealm.publicUUID)
  ↓
MultiTenantController.getByApplicationAndEnvironment
  ↓ (todos decorators executam: @Audit, @Auth, etc)
  ↓
ApplicationConfigurationService
  ↓
ApplicationConfigurationRepository
```

### Vantagens

- ✅ **Reutiliza controller multi-tenant** (DRY - Don't Repeat Yourself)
- ✅ **Todos decorators executam** (@Audit, @Auth, @Validation, etc)
- ✅ **Sem bypass** da camada de controller
- ✅ **Decorator pattern** (idiomático no framework)
- ✅ **Sem duplicação de código**
- ✅ **Type-safe** (usa mesmos tipos)
- ✅ **Declarativo** (clara intenção no código)

### Desvantagens

- ⚠️ Decorator precisa ter acesso ao container
- ⚠️ RealmService deve estar registrado no container

---

## Implementação

### 1. Decorator no Framework (`.external/koa-inversify-framework/src/decorator/injectCoreTenantId.decorator.ts`)

```typescript
import { Context, Next } from 'koa';

/**
 * @InjectCoreTenantId Decorator
 *
 * Injeta automaticamente o tenantId do core realm no contexto.
 * Permite reutilizar controllers multi-tenant em rotas públicas sem expor tenantId na URL.
 */
export function InjectCoreTenantId(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context, next?: Next) {
      // Busca container
      const container = (this as any).container || (global as any).__container__;
      
      if (!container) {
        throw new Error('@InjectCoreTenantId: Container not found.');
      }

      // Busca RealmService
      const RealmServiceSymbol = Symbol.for('RealmService');
      const realmService = container.get(RealmServiceSymbol);

      // Injeta core tenantId
      const coreRealm = await realmService.getRealmCore();
      ctx.params.tenantId = coreRealm.publicUUID;

      // Executa método original
      return originalMethod.call(this, ctx, next);
    };

    return descriptor;
  };
}
```

### 2. Controller Público (`src/domain/core/application-configuration/application-configuration.controller.ts`)

```typescript
import { inject } from 'inversify';
import { Context } from 'koa';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, SwaggerDoc, SwaggerDocController, InjectCoreTenantId } from 'koa-inversify-framework/decorator';
import { commonErrorResponses } from 'koa-inversify-framework/common';
import { z } from 'zod';
import {
  ApplicationConfigurationController as MultiTenantController,
  ApplicationConfigurationControllerSymbol as MultiTenantControllerSymbol,
} from '@/domain/realm/application-configuration/application-configuration.controller';
import { applicationConfigurationResponseSchema } from '@/domain/realm/application-configuration/application-configuration.dto';

export const CoreApplicationConfigurationControllerSymbol = Symbol.for('CoreApplicationConfigurationController');

@SwaggerDocController({
  name: 'Core Application Configuration',
  description: 'Public application configuration (core realm)',
  tags: ['Core Application Configuration'],
})
@Controller(CoreApplicationConfigurationControllerSymbol, {
  basePath: '/api/core/application-configuration',
})
export class CoreApplicationConfigurationController {
  constructor(
    @inject(MultiTenantControllerSymbol) private multiTenantController: MultiTenantController
  ) {}

  @SwaggerDoc({
    summary: 'Get configuration by application and environment (core realm)',
    description: 'Returns configuration for specific application and environment from core realm',
    tags: ['Core Application Configuration'],
    request: {
      params: z.object({
        applicationId: z.string(),
        environment: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Configuration found',
        content: {
          'application/json': {
            schema: applicationConfigurationResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @InjectCoreTenantId()  // ← Decorator injeta core tenantId
  @Get('/app/:applicationId/env/:environment')
  async getByApplicationAndEnvironment(
    ctx: Context & { params: { applicationId: string; environment: string } }
  ): Promise<void> {
    return this.multiTenantController.getByApplicationAndEnvironment(ctx);
  }
}
```

### 3. Module (`src/domain/core/application-configuration/application-configuration.module.ts`)

```typescript
import { AbstractModule } from 'koa-inversify-framework/abstract';
import {
  CoreApplicationConfigurationController,
  CoreApplicationConfigurationControllerSymbol,
} from './application-configuration.controller';

export class CoreApplicationConfigurationModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(CoreApplicationConfigurationControllerSymbol)
      .to(CoreApplicationConfigurationController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return CoreApplicationConfigurationControllerSymbol;
  }
}
```

### 4. Integração (`src/domain/core/index.ts`)

```typescript
import { Container } from 'inversify';
import { RealmModule } from '@/domain/core/realm/realm.module';
import { CoreApplicationConfigurationModule } from '@/domain/core/application-configuration/application-configuration.module';

export async function initCoreModules(container: Container): Promise<void> {
  new RealmModule(container);
  new CoreApplicationConfigurationModule(container);
}
```

---

## Fluxo Completo

### Rota Multi-Tenant (já existe)
```
GET /api/realm/:tenantId/application-configuration/app/:appId/env/:env
  ↓
ApplicationConfigurationController.getByApplicationAndEnvironment
  ↓ (decorators executam)
  ↓
Service → Repository
```

### Rota Pública (nova)
```
GET /api/core/application-configuration/app/:appId/env/:env
  ↓
CoreApplicationConfigurationController.getByApplicationAndEnvironment
  ↓
@InjectCoreTenantId() decorator (injeta tenantId = coreRealm.publicUUID)
  ↓
ApplicationConfigurationController.getByApplicationAndEnvironment (multi-tenant)
  ↓ (MESMOS decorators executam!)
  ↓
Service → Repository
```

**Resultado:** Ambas rotas usam o mesmo controller, mesma lógica, mesmos decorators!

---

## Casos de Uso

### 1. Config Server (Spring Cloud Style)
```bash
# Aplicação busca config no startup (sem saber tenantId)
curl http://api.example.com/api/core/application-configuration/app/web-admin-uuid/env/production

# Retorna config do core realm
{
  "applicationId": "web-admin-uuid",
  "environment": "production",
  "config": {
    "api": { "main": { "url": "https://api.prod.com" } },
    "features": { "analytics": true }
  }
}
```

### 2. Admin Operations
```bash
# Admin gerencia configs de qualquer tenant
curl http://api.example.com/api/realm/tenant-123/application-configuration/app/app-uuid/env/dev

# Retorna config do tenant-123
```

---

## Padrão Reutilizável

Este padrão pode ser aplicado a **qualquer domínio multi-tenant** que precise de rotas públicas:

1. Criar controller público que injeta controller multi-tenant
2. Usar decorator `@InjectCoreTenantId()` no método
3. Controller multi-tenant executa normalmente com todos decorators

**Exemplos de uso futuro:**
```typescript
// Accounts públicos (core realm)
@Controller('/api/core/account')
class CoreAccountController {
  @InjectCoreTenantId()
  @Get('/:id')
  async findById(ctx) { ... }
}

// Applications públicos (core realm)
@Controller('/api/core/application')
class CoreApplicationController {
  @InjectCoreTenantId()
  @Get('/')
  async findAll(ctx) { ... }
}
```

---

## Referências

- **Framework Decorator:** `.external/koa-inversify-framework/src/decorator/injectCoreTenantId.decorator.ts`
- **Old Implementation:** `old/src/domains/config/config.controller.ts` (repairDefaultSetup)
- **Multi-Tenant Controller:** `src/domain/realm/application-configuration/application-configuration.controller.ts`
- **Core Controller:** `src/domain/core/application-configuration/application-configuration.controller.ts`

---

## Notas Importantes

- ⚠️ **Segurança:** Rotas públicas devem ter autenticação/autorização adequada
- ⚠️ **Performance:** Decorator busca core realm em toda requisição (considerar cache)
- ⚠️ **Container:** RealmService deve estar registrado no container antes do uso
- ⚠️ **Testes:** Testar ambas rotas (pública e multi-tenant) para garantir consistência
- ⚠️ **Documentação:** Swagger deve documentar ambas rotas separadamente

---

## Conclusão

O padrão **Decorator @InjectCoreTenantId** permite reutilizar controllers multi-tenant em rotas públicas sem fazer bypass da camada de controller, garantindo que todos os decorators (@Audit, @Auth, etc) sejam executados corretamente.

Este é o padrão recomendado para qualquer situação onde precisamos expor funcionalidade multi-tenant através de rotas públicas que operam em um tenant específico (geralmente o core realm).
