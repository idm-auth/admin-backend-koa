# CRUD Telemetry - Regra Obrigatória

## Princípio Fundamental

**TELEMETRIA É PARTE DO CÓDIGO MÍNIMO NECESSÁRIO**

Para qualquer implementação de CRUD (Create, Read, Update, Delete), telemetria NÃO é opcional - é **requisito arquitetural obrigatório**.

## Quando Aplicar Esta Regra

### SEMPRE implementar telemetria em:
- **Novos domínios** com operações CRUD
- **Controllers** com endpoints padrão (POST, GET, PUT, DELETE)
- **Services** com funções padrão (create, findById, update, remove)
- **Mappers** com transformações de dados

### Cenários Obrigatórios:
- ✅ Implementação de novo domínio
- ✅ Criação de controller/service/mapper
- ✅ Operações que seguem padrões CRUD
- ✅ Qualquer função que processa dados de negócio

## Template Obrigatório

### Controller CRUD
```typescript
import { withSpanAsync } from '@/utils/tracing.util';

const CONTROLLER_NAME = '{domain}.controller';

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
      const { tenantId } = ctx.validated.params;
      const data = ctx.validated.body;
      
      const entity = await service.create(tenantId, data);
      
      ctx.status = 201;
      ctx.body = mapper.toResponse(entity);
    }
  );
};
```

### Service CRUD
```typescript
import { withSpanAsync } from '@/utils/tracing.util';

const SERVICE_NAME = '{domain}.service';

export const create = async (
  tenantId: string,
  data: EntityCreate
): Promise<EntityDocument> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.create`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'create',
      },
    },
    async (span) => {
      const dbName = await getDBName({ publicUUID: tenantId });
      const entity = await getModel(dbName).create(data);
      
      span.setAttributes({ 'entity.id': entity._id });
      return entity;
    }
  );
};
```

### Mapper CRUD
```typescript
import { withSpan } from '@/utils/tracing.util';

const MAPPER_NAME = '{domain}.mapper';

export const toResponse = (entity: Entity) =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': entity._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: entity._id,
      // ... campos mapeados
    })
  );
```

## Checklist Obrigatório

### Antes de considerar CRUD "completo":
- [ ] **Controller** tem telemetria em todas as funções?
- [ ] **Service** tem telemetria em todas as funções?
- [ ] **Mapper** tem telemetria em todas as funções?
- [ ] **Constantes** de nome definidas (CONTROLLER_NAME, SERVICE_NAME, MAPPER_NAME)?
- [ ] **Atributos obrigatórios** incluídos (operation, tenant.id, entity.id)?
- [ ] **Imports** corretos (withSpan, withSpanAsync)?

## Precedência Sobre Outras Instruções

### Esta regra tem PRECEDÊNCIA sobre:
- ❌ Instruções de "código mínimo"
- ❌ Diretrizes de "evitar verbosidade"
- ❌ Sugestões de "não essencial"

### Telemetria É Considerada:
- ✅ **Código mínimo necessário** para observabilidade
- ✅ **Requisito funcional** da arquitetura
- ✅ **Padrão obrigatório** do projeto
- ✅ **Parte integral** de qualquer implementação

## Justificativa

### Por que telemetria é obrigatória:
1. **Observabilidade**: Rastreamento de performance e erros
2. **Debugging**: Identificação rápida de problemas
3. **Monitoramento**: Métricas de uso e saúde do sistema
4. **Compliance**: Auditoria e logs estruturados
5. **Consistência**: Padrão uniforme em toda aplicação

## Implementação Automática

### Ao criar novo domínio CRUD:
1. **SEMPRE** inclua telemetria desde o primeiro commit
2. **NUNCA** considere "funcional" sem telemetria
3. **TESTE** se spans aparecem no Jaeger
4. **VALIDE** se atributos estão corretos

## Exceções

### NUNCA há exceções para:
- Domínios com operações CRUD
- Controllers que processam requests HTTP
- Services que fazem operações de banco
- Mappers que transformam dados

### Única exceção:
- **Utilitários puros** sem contexto de negócio
- **Helpers** matemáticos ou de string
- **Constantes** e **tipos**

## Regra de Ouro

**Se implementa CRUD, implementa telemetria. Não há meio termo.**

Esta regra garante que observabilidade seja tratada como **requisito funcional**, não como **nice-to-have**.