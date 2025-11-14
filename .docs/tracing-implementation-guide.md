# Guia de Implementação de Tracing

## Quick Start

### 1. Imports Necessários
```typescript
import { withSpan, withSpanAsync } from '@/utils/tracing.util';

// Constante do componente
const CONTROLLER_NAME = 'domain.controller';
const SERVICE_NAME = 'domain.service';
const MAPPER_NAME = 'domain.mapper';
```

### 2. Controller Pattern
```typescript
export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.create`,
      attributes: {
        operation: 'create',
        'http.method': 'POST',
      },
    },
    async () => {
      // lógica do controller
    }
  );
};
```

### 3. Service Pattern
```typescript
export const create = async (tenantId: string, data: EntityCreate) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.create`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'create',
      },
    },
    async (span) => {
      // lógica do service
      span.setAttributes({ 'entity.id': result._id });
      return result;
    }
  );
};
```

### 4. Mapper Pattern
```typescript
export const toCreateResponse = (entity: Entity) =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toCreateResponse`,
      attributes: {
        'entity.id': entity._id.toString(),
        operation: 'toCreateResponse',
      },
    },
    () => ({
      // mapeamento
    })
  );
```

## Checklist de Implementação

### ✅ Para cada domínio:
- [ ] Controller: todas as funções com `withSpanAsync`
- [ ] Service: todas as funções com `withSpanAsync`
- [ ] Mapper: todas as funções com `withSpan`
- [ ] Constantes: `CONTROLLER_NAME`, `SERVICE_NAME`, `MAPPER_NAME`

### ✅ Atributos obrigatórios:
- [ ] `operation`: nome da operação
- [ ] `tenant.id`: quando aplicável
- [ ] `entity.id`: quando disponível
- [ ] `http.method`: em controllers

### ✅ Verificação:
- [ ] Jaeger UI mostra traces: http://localhost:16686
- [ ] Hierarquia correta de spans
- [ ] Sem erros de linting
- [ ] Performance não impactada

## Exemplos Completos

### Domain: Accounts
```typescript
// account.controller.ts
const CONTROLLER_NAME = 'account.controller';

export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.create`,
      attributes: {
        operation: 'create',
        'http.method': 'POST',
      },
    },
    async () => {
      const account = await accountService.create(
        ctx.validated.params.tenantId,
        ctx.validated.body
      );
      ctx.status = 201;
      ctx.body = accountMapper.toCreateResponse(account);
    }
  );
};

// account.service.ts
const SERVICE_NAME = 'account.service';

export const create = async (tenantId: string, data: AccountCreate) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.create`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'create',
        'account.email': data.email,
      },
    },
    async (span) => {
      const account = await getModel(dbName).create(data);
      span.setAttributes({ 'account.id': account._id });
      return account;
    }
  );
};

// account.mapper.ts
const MAPPER_NAME = 'account.mapper';

export const toCreateResponse = (account: Account) =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toCreateResponse`,
      attributes: {
        'account.id': account._id.toString(),
        operation: 'toCreateResponse',
      },
    },
    () => ({
      _id: account._id.toString(),
      email: getPrimaryEmail(account),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    })
  );
```

## Comandos Úteis

### Verificar Traces
```bash
# Acessar Jaeger UI
open http://localhost:16686

# Verificar métricas Prometheus
curl http://localhost:9090/metrics

# Logs de telemetria
docker logs backend-koa-iam | grep -i "opentelemetry\|trace"
```

### Debug de Conectividade
```bash
# Testar endpoint OTLP
curl -X POST http://localhost:4318/v1/traces \
  -H "Content-Type: application/json" \
  -d '{"resourceSpans":[]}'

# Verificar portas
netstat -tulpn | grep -E "(4318|16686|9090)"
```

## Troubleshooting Rápido

### Problema: Traces não aparecem
**Solução**: Verificar se Jaeger está rodando e endpoint está correto

### Problema: Spans órfãos (sem hierarquia)
**Solução**: Usar sempre `withSpan`/`withSpanAsync`, nunca `startSpan` manual

### Problema: Performance degradada
**Solução**: Verificar se não há loops de tracing ou atributos excessivos

### Problema: Linting errors
**Solução**: Remover parâmetros `span` não utilizados das funções

## Próximos Passos

1. **Implementar** tracing em todos os domínios
2. **Configurar** alertas baseados em métricas
3. **Criar** dashboards de monitoramento
4. **Definir** SLOs baseados em traces
5. **Otimizar** sampling para produção

## Recursos

- **Jaeger UI**: http://localhost:16686
- **Prometheus**: http://localhost:9090/metrics
- **OpenTelemetry Docs**: https://opentelemetry.io/docs/
- **Jaeger Docs**: https://www.jaegertracing.io/docs/