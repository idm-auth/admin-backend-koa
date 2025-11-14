# Regras de Telemetria e Tracing

## Configuração OpenTelemetry

### Setup Obrigatório
- **OpenTelemetry SDK** configurado em `src/telemetry.ts`
- **Auto-instrumentação** habilitada para observabilidade completa
- **OTLP Exporter** para Jaeger (porta 4318)
- **Prometheus Exporter** para métricas (porta 9090)

### Constantes Centralizadas
```typescript
// src/telemetry.ts
export const SERVICE_NAME = 'backend-koa-iam';
export const SERVICE_VERSION = '1.0.0';
```

## Implementação de Tracing Manual

### Imports Obrigatórios
```typescript
import { withSpan, withSpanAsync } from '@/utils/tracing.util';
import { SERVICE_NAME, SERVICE_VERSION } from '@/telemetry';
```

### Constantes por Camada
- **Controller**: `const CONTROLLER_NAME = '{domain}.controller';`
- **Service**: `const SERVICE_NAME = '{domain}.service';`
- **Mapper**: `const MAPPER_NAME = '{domain}.mapper';`

## Padrões de Implementação

### Controllers (Async)
```typescript
export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.create`,
      attributes: {
        operation: 'create',
        'http.method': 'POST',
        'entity.id': id, // quando disponível
      },
    },
    async () => {
      // lógica do controller
    }
  );
};
```

### Services (Async)
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
      span.setAttributes({ 'entity.id': result._id }); // após criação
      return result;
    }
  );
};
```

### Mappers (Sync)
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

## Atributos Padronizados

### Atributos Obrigatórios
- **operation**: Nome da operação (`create`, `findById`, `update`, etc.)
- **tenant.id**: ID do tenant (quando aplicável)
- **entity.id**: ID da entidade (quando disponível)

### Atributos HTTP (Controllers)
- **http.method**: Método HTTP (`GET`, `POST`, `PUT`, `DELETE`)
- **http.status_code**: Código de status (quando aplicável)

### Atributos de Paginação
- **pagination.page**: Página atual
- **pagination.limit**: Limite por página
- **result.total**: Total de registros
- **result.totalPages**: Total de páginas

### Atributos de Query
- **query.filter**: Filtro aplicado
- **query.sortBy**: Campo de ordenação
- **query.descending**: Ordenação descendente

## Uso de Spans Dinâmicos

### span.setAttributes()
```typescript
// Durante execução para adicionar dados dinâmicos
span.setAttributes({
  'db.name': dbName,
  'result.count': results.length,
  'entity.created': true,
});
```

### Atributos Condicionais
```typescript
if (filter) {
  span.setAttributes({ 'query.filter': filter });
}
```

## Hierarquia de Spans

### Context Propagation
- **SEMPRE use** `withSpan`/`withSpanAsync` para manter hierarquia
- **NUNCA** use `startSpan`/`endSpan` manualmente
- **Context.with()** é gerenciado automaticamente pelas funções wrapper

### Estrutura Esperada
```
HTTP Request (auto)
├── Controller.method (manual)
    ├── Service.method (manual)
    │   ├── Database Query (auto)
    │   └── External API (auto)
    └── Mapper.method (manual)
```

## Auto-Instrumentação

### Instrumentações Ativas
- **HTTP** (requests/responses)
- **MongoDB** (queries)
- **DNS** (lookups)
- **File System** (operações)
- **Net** (conexões)

### Benefícios
- **Observabilidade completa** sem código adicional
- **Performance insights** de operações externas
- **Debugging** de conectividade e latência
- **Monitoramento** de dependências

## Nomenclatura de Spans

### Padrão Obrigatório
- **Controllers**: `{domain}.controller.{method}`
- **Services**: `{domain}.service.{method}`
- **Mappers**: `{domain}.mapper.{method}`

### Exemplos
```typescript
// Controllers
'account.controller.create'
'realm.controller.findById'

// Services  
'account.service.create'
'realm.service.findByPublicUUID'

// Mappers
'account.mapper.toCreateResponse'
'realm.mapper.toListItemResponse'
```

## Tratamento de Erros

### Automático nas Funções Wrapper
- **span.recordException()** para capturar erros
- **span.setStatus()** com código de erro
- **span.end()** sempre executado no finally

### Não Interferir
- **NUNCA** trate erros dentro dos wrappers
- **Deixe** erros propagarem naturalmente
- **Spans** são finalizados automaticamente

## Métricas Prometheus

### Exportação Automática
- **Porta 9090** configurada
- **Endpoint /metrics** disponível
- **Métricas OpenTelemetry** exportadas automaticamente

## Jaeger UI

### Acesso
- **URL**: http://localhost:16686
- **Traces** disponíveis em tempo real
- **Busca** por service, operation, tags

### Análise
- **Timeline** de execução
- **Dependências** entre services
- **Performance** de cada span
- **Erros** e exceptions

## Regras de Implementação

### SEMPRE Implementar
- **Todos os controllers** devem ter tracing
- **Todos os services** devem ter tracing  
- **Todos os mappers** devem ter tracing
- **Constantes** para nomes de componentes

### NUNCA Fazer
- **Tracing manual** com startSpan/endSpan
- **Spans órfãos** sem context propagation
- **Hardcode** de nomes de spans
- **Supressão** de auto-instrumentação sem motivo

### Padrão de Qualidade
- **Atributos relevantes** em cada span
- **Nomenclatura consistente** em todo projeto
- **Hierarquia correta** de spans
- **Performance** não impactada significativamente
