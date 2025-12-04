# Arquitetura e Padrões - IA Rules

## TRIGGERS AUTOMÁTICOS - ESTRUTURA DDD

### SE organizando código
→ **ENTÃO** use `src/domains/{contexto}/{dominio}/` sempre

### SE criando domínio
→ **ENTÃO** use estrutura: controller, service, model, schema, routes na raiz

### SE fazendo import entre domínios
→ **ENTÃO** use paths absolutos `@/domains/{contexto}/{dominio}/{arquivo}`

### SE fazendo import dentro do domínio
→ **ENTÃO** use imports relativos `./arquivo`

### SE definindo rotas
→ **ENTÃO** use MagicRouter, NUNCA Router tradicional

### SE criando rota
→ **ENTÃO** inclua name, summary, handlers, request/responses, tags

### SE definindo validações de rota
→ **ENTÃO** use schemas Zod para params, query, body e responses

### SE compondo routers
→ **ENTÃO** use `router.useMagic(childRouter)` para hierarquia

## TRIGGERS AUTOMÁTICOS - TENANT PATTERN

### SE função precisa de tenantId
→ **ENTÃO** tenantId SEMPRE primeiro parâmetro separado dos dados

### SE criando função service
→ **ENTÃO** use padrão: `create(tenantId, data)`, `update(tenantId, id, data)`

### SE agrupando parâmetros
→ **ENTÃO** NUNCA agrupe tenantId com dados em objetos

### SE definindo ordem de parâmetros
→ **ENTÃO** use: tenantId, id (se necessário), data (se necessário)

## TRIGGERS AUTOMÁTICOS - SERVICE PATTERN

### SE service não encontra recurso
→ **ENTÃO** lance `throw new NotFoundError('message')`, NUNCA retorne null

### SE service encontra recurso
→ **ENTÃO** retorne objeto diretamente

### SE estruturando função service
→ **ENTÃO** validações primeiro, operação banco, verificação resultado, retorno

## TRIGGERS AUTOMÁTICOS - RESPONSABILIDADES

### SE no controller
→ **ENTÃO** use `ctx.validated`, chame services, NUNCA lógica de negócio

### SE no service
→ **ENTÃO** toda lógica de negócio, receba dados já validados

### SE no model
→ **ENTÃO** apenas estrutura de dados e validações de schema

### SE definindo exports
→ **ENTÃO** use `export const`, NUNCA `export default`

## AÇÕES OBRIGATÓRIAS

### Estrutura de domínios
- **realms/**: Multi-tenant (accounts, groups, roles, policies)
- **core/**: Funcionalidades centrais (config, realm)
- **commons/**: Componentes compartilhados (base, validations)

### Arquitetura simplificada
- **Arquivos diretamente na raiz** do domínio
- **Sem versionamento interno** (latest/, v1/)
- **Versionamento via containers** quando necessário

### Padrão TenantId obrigatório
```typescript
// ✅ Correto
export const create = async (
  tenantId: PublicUUID,
  data: EntityCreate
): Promise<EntityDocument> => {
  // implementação
};

// ❌ Incorreto - tenantId misturado
export const create = async (args: {
  tenantId: PublicUUID;
  data: EntityCreate;
}): Promise<EntityDocument> => {};
```

### Service pattern obrigatório
```typescript
// ✅ Correto
export const findById = async (tenantId: PublicUUID, id: DocId) => {
  const entity = await getModel().findById(id);
  if (!entity) {
    throw new NotFoundError('Entity not found');
  }
  return entity;
};

// ❌ Incorreto - retorna null
export const findById = async (tenantId: PublicUUID, id: DocId) => {
  const entity = await getModel().findById(id);
  return entity ? entity.toObject() : null;
};
```

### MagicRouter obrigatório
```typescript
// ✅ Correto
const router = new MagicRouter({ prefix: '/accounts' });

router.post({
  name: 'createAccount',
  path: '/',
  summary: 'Create account',
  handlers: [controller.create],
  request: {
    params: requestTenantIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: accountCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Account created successfully',
      content: {
        'application/json': {
          schema: accountResponseSchema,
        },
      },
    },
  },
  tags: ['Accounts'],
});

// ❌ Incorreto - Router tradicional
const router = new Router();
router.post('/accounts', controller.create);
```

## GUARDRAILS OBRIGATÓRIOS

### Tenant Pattern inviolável
- **NUNCA** há exceções para padrão tenantId
- **SEMPRE** tenantId primeiro parâmetro separado
- **NUNCA** agrupe parâmetros em objetos

### Service Pattern obrigatório
- **NUNCA** retorne null/undefined em services
- **SEMPRE** lance erro específico quando não encontrar
- **SEMPRE** retorne objeto diretamente quando encontrar

### Separação de responsabilidades
- **NUNCA** coloque lógica de negócio no controller
- **SEMPRE** use `ctx.validated` no controller
- **NUNCA** faça validação dupla

## PADRÕES DE RECONHECIMENTO

### DDD correto quando vejo:
- Código organizado por domínios
- Imports absolutos entre domínios
- Imports relativos dentro do domínio
- MagicRouter em vez de Router tradicional

### MagicRouter correto quando vejo:
- `new MagicRouter({ prefix: '/resource' })`
- Rotas com name, summary, handlers, request, responses
- Schemas Zod para validação de entrada e saída
- `router.useMagic()` para composição

### Tenant pattern correto quando vejo:
- `create(tenantId, data)`
- `update(tenantId, id, data)`
- `findById(tenantId, id)`
- TenantId sempre primeiro parâmetro

### Service pattern correto quando vejo:
- `throw new NotFoundError()` quando não encontra
- Retorno direto do objeto quando encontra
- Estrutura: validações → operação → verificação → retorno

## REGRA DE OURO

**"TenantId sempre primeiro, separado dos dados. Service retorna objeto ou lança erro."**