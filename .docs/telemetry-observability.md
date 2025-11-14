# Telemetria e Observabilidade

## Visão Geral

O Backend-Koa IAM implementa observabilidade completa usando **OpenTelemetry** com exportação para **Jaeger** (traces) e **Prometheus** (métricas).

## Arquitetura de Observabilidade

### Componentes
- **OpenTelemetry SDK**: Coleta e processamento de telemetria
- **Jaeger**: Visualização e análise de traces distribuídos
- **Prometheus**: Coleta e armazenamento de métricas
- **Auto-instrumentação**: Tracing automático de dependências
- **Manual instrumentation**: Tracing customizado de business logic

### Stack Tecnológica
```typescript
@opentelemetry/sdk-node                    // SDK principal
@opentelemetry/auto-instrumentations-node // Auto-instrumentação
@opentelemetry/exporter-trace-otlp-http   // Exportador OTLP
@opentelemetry/exporter-prometheus        // Exportador Prometheus
```

## Configuração

### Docker Services
```yaml
# .devcontainer/docker-compose.yml
jaeger:
  image: jaegertracing/all-in-one:latest
  ports:
    - "16686:16686"  # Jaeger UI
    - "14268:14268"  # Jaeger collector HTTP
    - "4318:4318"    # OTLP HTTP collector
  environment:
    - COLLECTOR_OTLP_ENABLED=true

backend:
  environment:
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: http://jaeger:4318/v1/traces
    PROMETHEUS_PORT: 9090
```

### Inicialização
```typescript
// src/telemetry.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  serviceName: 'backend-koa-iam',
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: new OTLPTraceExporter({
    url: 'http://jaeger:4318/v1/traces',
  }),
  metricReader: new PrometheusExporter({
    port: 9090,
    endpoint: '/metrics',
  }),
});
```

## Implementação de Tracing

### Utilitários de Tracing
```typescript
// src/utils/tracing.util.ts
export const withSpan = <T>(
  config: { name: string; attributes?: Record<string, any> },
  fn: (span: Span) => T
): T => { /* implementação */ };

export const withSpanAsync = async <T>(
  config: { name: string; attributes?: Record<string, any> },
  fn: (span: Span) => Promise<T>
): Promise<T> => { /* implementação */ };
```

### Padrão de Implementação

#### Controllers
```typescript
import { withSpanAsync } from '@/utils/tracing.util';

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
```

#### Services
```typescript
const SERVICE_NAME = 'account.service';

export const create = async (
  tenantId: string,
  data: AccountCreate
): Promise<Account> => {
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
      const logger = await getLogger();
      logger.info({ tenantId, email: data.email }, 'Creating account');

      // Business logic
      const account = await getModel(dbName).create(validatedData);
      
      // Adicionar atributos dinâmicos
      span.setAttributes({ 'account.id': account._id });
      
      return account;
    }
  );
};
```

#### Mappers
```typescript
const MAPPER_NAME = 'account.mapper';

export const toCreateResponse = (account: Account): AccountCreateResponse =>
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

## Auto-Instrumentação

### Instrumentações Ativas
- **HTTP**: Requests e responses automáticos
- **MongoDB**: Queries e operações de banco
- **DNS**: Resoluções de nomes
- **File System**: Operações de arquivo
- **Net**: Conexões de rede

### Traces Automáticos Comuns
```json
{
  "operationName": "dns.lookup",
  "tags": [
    { "key": "peer.ipv4", "value": "172.247.1.3" }
  ]
}

{
  "operationName": "mongodb.find",
  "tags": [
    { "key": "db.system", "value": "mongodb" },
    { "key": "db.name", "value": "tenant-db" },
    { "key": "db.collection.name", "value": "accounts" }
  ]
}

{
  "operationName": "HTTP GET",
  "tags": [
    { "key": "http.method", "value": "GET" },
    { "key": "http.url", "value": "/api/realm/123/accounts" },
    { "key": "http.status_code", "value": 200 }
  ]
}
```

## Atributos Padronizados

### Contexto de Negócio
```typescript
{
  'tenant.id': tenantId,           // ID do tenant
  'account.id': accountId,         // ID da entidade
  'account.email': email,          // Email do usuário
  operation: 'create',             // Operação executada
}
```

### Contexto HTTP
```typescript
{
  'http.method': 'POST',           // Método HTTP
  'http.status_code': 201,         // Status de resposta
  'http.url': '/api/accounts',     // URL da requisição
}
```

### Contexto de Paginação
```typescript
{
  'pagination.page': 1,            // Página atual
  'pagination.limit': 10,          // Itens por página
  'result.total': 150,             // Total de registros
  'result.totalPages': 15,         // Total de páginas
}
```

### Contexto de Query
```typescript
{
  'query.filter': 'john',          // Filtro aplicado
  'query.sortBy': 'email',         // Campo de ordenação
  'query.descending': false,       // Direção da ordenação
}
```

## Hierarquia de Spans

### Estrutura Típica
```
HTTP POST /api/realm/123/accounts (auto)
├── account.controller.create (manual)
    ├── account.service.create (manual)
    │   ├── mongodb.create (auto)
    │   └── dns.lookup (auto)
    └── account.mapper.toCreateResponse (manual)
```

### Context Propagation
- **Automática**: Spans filhos herdam contexto do pai
- **Hierárquica**: Visualização em árvore no Jaeger
- **Distribuída**: Funciona entre serviços diferentes

## Análise de Performance

### Métricas Importantes
- **Latência**: Tempo total de execução
- **Throughput**: Requests por segundo
- **Error Rate**: Taxa de erros
- **Dependency Latency**: Tempo de dependências externas

### Identificação de Gargalos
```
Total Request: 250ms
├── Controller: 2ms
├── Service: 200ms
│   ├── Business Logic: 50ms
│   └── MongoDB Query: 150ms ← GARGALO
└── Mapper: 1ms
```

## Jaeger UI

### Acesso
- **URL**: http://localhost:16686
- **Service**: backend-koa-iam
- **Operations**: Lista todas as operações instrumentadas

### Funcionalidades
- **Trace Search**: Busca por service, operation, tags
- **Timeline View**: Visualização temporal dos spans
- **Dependency Graph**: Mapa de dependências entre services
- **Error Analysis**: Análise de erros e exceptions

### Filtros Úteis
```
service=backend-koa-iam operation=account.controller.create
service=backend-koa-iam tag="tenant.id:123"
service=backend-koa-iam tag="http.status_code:500"
```

## Prometheus Metrics

### Endpoint
- **URL**: http://localhost:9090/metrics
- **Formato**: OpenMetrics/Prometheus

### Métricas Automáticas
```
# Request duration
http_request_duration_seconds_bucket{method="POST",route="/accounts"}

# Request count
http_requests_total{method="POST",status="201"}

# Active spans
otel_spans_active{service="backend-koa-iam"}
```

## Debugging com Traces

### Identificar Problemas
1. **Buscar traces com erro** no Jaeger
2. **Analisar timeline** para identificar span problemático
3. **Verificar tags e logs** do span com erro
4. **Rastrear causa raiz** através da hierarquia

### Exemplo de Debug
```json
{
  "operationName": "account.service.create",
  "tags": [
    { "key": "error", "value": true },
    { "key": "tenant.id", "value": "invalid-tenant" }
  ],
  "logs": [
    {
      "timestamp": 1763067772473000,
      "fields": [
        { "key": "event", "value": "error" },
        { "key": "message", "value": "Tenant not found" }
      ]
    }
  ]
}
```

## Best Practices

### Performance
- **Sampling**: Configure sampling rate para produção
- **Batch Export**: Use batch export para reduzir overhead
- **Attribute Limits**: Limite número de atributos por span

### Segurança
- **Sanitize Data**: Não inclua dados sensíveis em atributos
- **PII Protection**: Evite informações pessoais em traces
- **Access Control**: Restrinja acesso ao Jaeger em produção

### Monitoramento
- **Alertas**: Configure alertas baseados em métricas
- **Dashboards**: Crie dashboards para visualização
- **SLOs**: Defina Service Level Objectives baseados em traces

## Troubleshooting

### Traces Não Aparecem
1. Verificar se Jaeger está rodando na porta 4318
2. Confirmar endpoint OTLP: `http://jaeger:4318/v1/traces`
3. Verificar logs de inicialização do OpenTelemetry
4. Testar conectividade: `curl http://localhost:4318/v1/traces`

### Performance Impact
- **Overhead mínimo**: < 5% em condições normais
- **Sampling**: Reduza para 10% em produção se necessário
- **Async Export**: Exportação não bloqueia requests

### Configuração de Produção
```typescript
const sdk = new NodeSDK({
  serviceName: SERVICE_NAME,
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: new OTLPTraceExporter({
    url: process.env.JAEGER_OTLP_ENDPOINT,
  }),
  sampler: new TraceIdRatioBasedSampler(0.1), // 10% sampling
});
```

## Integração com Logs

### Correlation IDs
- **Trace ID**: Automaticamente incluído nos logs
- **Span ID**: Contexto específico do span
- **Correlation**: Facilita debugging entre logs e traces

### Structured Logging
```typescript
const logger = await getLogger();
logger.info(
  { 
    traceId: trace.getActiveSpan()?.spanContext().traceId,
    tenantId,
    operation: 'create'
  },
  'Account created successfully'
);
```

Esta implementação fornece observabilidade completa para debugging, monitoramento e análise de performance do sistema IAM.