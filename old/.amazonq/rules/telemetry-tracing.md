# Telemetria e Tracing - IA Rules

## TRIGGERS AUTOMÁTICOS - IMPLEMENTAÇÃO

### SE criando controller
→ **ENTÃO** adicione telemetria com `withSpanAsync` + `CONTROLLER_NAME`

### SE criando service
→ **ENTÃO** adicione telemetria com `withSpanAsync` + `SERVICE_NAME`

### SE criando mapper
→ **ENTÃO** adicione telemetria com `withSpan` + `MAPPER_NAME`

### SE definindo constantes de telemetria
→ **ENTÃO** use padrão `{domain}.controller`, `{domain}.service`, `{domain}.mapper`

### SE adicionando atributos
→ **ENTÃO** inclua `operation`, `tenant.id`, `entity.id` quando disponível

## AÇÕES OBRIGATÓRIAS

### Templates obrigatórios
```typescript
// Controller
const CONTROLLER_NAME = '{domain}.controller';
export const create = async (ctx: Context) => {
  return withSpanAsync({
    name: `${CONTROLLER_NAME}.create`,
    attributes: { operation: 'create', 'http.method': 'POST' },
  }, async () => {
    // lógica
  });
};

// Service
import { PublicUUID } from '@/domains/commons/base/base.schema';

const SERVICE_NAME = '{domain}.service';
export const create = async (tenantId: PublicUUID, data: EntityCreate) => {
  return withSpanAsync({
    name: `${SERVICE_NAME}.create`,
    attributes: { 'tenant.id': tenantId, operation: 'create' },
  }, async (span) => {
    // lógica
    span.setAttributes({ 'entity.id': result._id });
    return result;
  });
};

// Mapper
const MAPPER_NAME = '{domain}.mapper';
export const toResponse = (entity: Entity) =>
  withSpan({
    name: `${MAPPER_NAME}.toResponse`,
    attributes: { 'entity.id': entity._id.toString(), operation: 'toResponse' },
  }, () => ({ /* mapeamento */ }));
```

## GUARDRAILS OBRIGATÓRIOS

### Implementação obrigatória
- **SEMPRE** use `withSpan`/`withSpanAsync` para manter hierarquia
- **NUNCA** use `startSpan`/`endSpan` manualmente
- **SEMPRE** defina constantes para nomes de componentes
- **NUNCA** faça hardcode de nomes de spans

### Atributos obrigatórios
- **operation**: `create`, `findById`, `update`, etc.
- **tenant.id**: ID do tenant (quando aplicável)
- **entity.id**: ID da entidade (quando disponível)
- **http.method**: Método HTTP nos controllers

## PADRÕES DE RECONHECIMENTO

### Telemetria correta quando vejo:
- Constantes definidas: `CONTROLLER_NAME`, `SERVICE_NAME`, `MAPPER_NAME`
- `withSpanAsync` em controllers e services
- `withSpan` em mappers
- Atributos padronizados em cada span

### Nomenclatura correta:
- `{domain}.controller.{method}`
- `{domain}.service.{method}`  
- `{domain}.mapper.{method}`

## REGRA DE OURO

**"Telemetria é obrigatória em controllers, services e mappers. Use wrappers, nunca spans manuais."**
