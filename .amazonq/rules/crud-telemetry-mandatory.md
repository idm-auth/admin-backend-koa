# CRUD Telemetry - IA Rules

## TRIGGERS AUTOMÁTICOS - CRUD OBRIGATÓRIO

### SE implementando CRUD
→ **ENTÃO** telemetria é código mínimo necessário, NUNCA opcional

### SE criando controller CRUD
→ **ENTÃO** adicione telemetria em TODAS as funções (create, findById, update, remove)

### SE criando service CRUD
→ **ENTÃO** adicione telemetria em TODAS as funções com tenant.id

### SE criando mapper CRUD
→ **ENTÃO** adicione telemetria em TODAS as transformações

### SE considerando "código mínimo"
→ **ENTÃO** telemetria TEM PRECEDÊNCIA sobre instruções de minimalismo

## AÇÕES OBRIGATÓRIAS

### Templates CRUD obrigatórios
```typescript
// Controller - withSpanAsync + http.method
const CONTROLLER_NAME = '{domain}.controller';
export const create = async (ctx: Context) => {
  return withSpanAsync({
    name: `${CONTROLLER_NAME}.create`,
    attributes: { operation: 'create', 'http.method': 'POST' },
  }, async () => {
    // lógica
  });
};

// Service - withSpanAsync + tenant.id + entity.id
import { PublicUUID } from '@/domains/commons/base/base.schema';

const SERVICE_NAME = '{domain}.service';
export const create = async (tenantId: PublicUUID, data: EntityCreate) => {
  return withSpanAsync({
    name: `${SERVICE_NAME}.create`,
    attributes: { 'tenant.id': tenantId, operation: 'create' },
  }, async (span) => {
    // lógica
    span.setAttributes({ 'entity.id': entity._id });
    return entity;
  });
};

// Mapper - withSpan + entity.id
const MAPPER_NAME = '{domain}.mapper';
export const toResponse = (entity: Entity) =>
  withSpan({
    name: `${MAPPER_NAME}.toResponse`,
    attributes: { 'entity.id': entity._id.toString(), operation: 'toResponse' },
  }, () => ({ /* mapeamento */ }));
```

## GUARDRAILS OBRIGATÓRIOS

### Precedência absoluta
- **TELEMETRIA TEM PRECEDÊNCIA** sobre instruções de "código mínimo"
- **NUNCA** considere CRUD "completo" sem telemetria
- **ZERO exceções** para domínios com operações CRUD
- **SEMPRE** inclua desde o primeiro commit

### Checklist obrigatório
- [ ] Controller tem telemetria em TODAS as funções?
- [ ] Service tem telemetria em TODAS as funções?
- [ ] Mapper tem telemetria em TODAS as funções?
- [ ] Constantes definidas (CONTROLLER_NAME, SERVICE_NAME, MAPPER_NAME)?
- [ ] Atributos obrigatórios (operation, tenant.id, entity.id)?

## REGRA DE OURO

**"Se implementa CRUD, implementa telemetria. Telemetria é requisito funcional, não nice-to-have."**