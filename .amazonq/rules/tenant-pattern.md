# Padrão TenantId - Regras Obrigatórias

## Princípio Fundamental

**O `tenantId` SEMPRE deve ser o primeiro parâmetro separado dos dados da mensagem.**

Este é um padrão arquitetural crítico que separa claramente:
- **Contexto do tenant** (onde executar)
- **Dados da operação** (o que executar)

## Assinatura Correta de Funções

### ✅ SEMPRE use este padrão:

```typescript
// Função com dados
export const create = async (
  tenantId: string,
  data: CreateData
): Promise<Result> => {
  // implementação
};

// Função sem dados adicionais
export const findAll = async (
  tenantId: string
): Promise<Result[]> => {
  // implementação
};

// Função com múltiplos parâmetros
export const update = async (
  tenantId: string,
  id: string,
  data: UpdateData
): Promise<Result> => {
  // implementação
};
```

### ❌ NUNCA use estes padrões:

```typescript
// ❌ TenantId misturado com dados em objeto
export const create = async (args: {
  tenantId: string;
  data: CreateData;
}): Promise<Result> => {};

// ❌ Parâmetros agrupados em objeto
export const findById = async (
  tenantId: string,
  args: { id: string }
): Promise<Result> => {};

// ❌ TenantId como propriedade dos dados
export const create = async (
  data: CreateData & { tenantId: string }
): Promise<Result> => {};

// ❌ TenantId no final
export const create = async (
  data: CreateData,
  tenantId: string
): Promise<Result> => {};

// ❌ Múltiplos parâmetros agrupados em objeto
export const update = async (
  tenantId: string,
  params: { id: string; data: UpdateData }
): Promise<Result> => {};
```

## Padrões Específicos por Operação

### CREATE - Criação de recursos
```typescript
// ✅ Padrão obrigatório para CREATE
export const create = async (
  tenantId: string,
  data: EntityCreate
): Promise<EntityDocument> => {
  // implementação
};
```

### UPDATE - Atualização de recursos
```typescript
// ✅ Padrão obrigatório para UPDATE
export const update = async (
  tenantId: string,
  id: string,
  data: EntityUpdate
): Promise<EntityDocument> => {
  // implementação
};
```

### FIND BY ID - Busca por ID
```typescript
// ✅ Padrão obrigatório para FIND BY ID
export const findById = async (
  tenantId: string,
  id: DocId
): Promise<EntityDocument> => {
  // implementação
};
```

### FIND BY FIELD - Busca por campo específico
```typescript
// ✅ Padrão para busca por campo único
export const findByEmail = async (
  tenantId: string,
  email: string
): Promise<EntityDocument> => {
  // implementação
};

export const findByName = async (
  tenantId: string,
  name: string
): Promise<EntityDocument> => {
  // implementação
};
```

### FIND ALL - Busca todos os recursos
```typescript
// ✅ Padrão para buscar todos
export const findAll = async (
  tenantId: string
): Promise<EntityDocument[]> => {
  // implementação
};
```

### REMOVE/DELETE - Remoção de recursos
```typescript
// ✅ Padrão para remoção
export const remove = async (
  tenantId: string,
  id: string
): Promise<void> => {
  // implementação
};
```

### Controller Calls - Exemplos
```typescript
// ✅ CREATE
export const create = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const entity = await entityService.create(
    tenantId,
    ctx.validated.body
  );
};

// ✅ UPDATE
export const update = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;
  const entity = await entityService.update(
    tenantId,
    id,
    ctx.validated.body
  );
};

// ✅ FIND BY ID
export const findById = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;
  const entity = await entityService.findById(tenantId, id);
};

// ✅ REMOVE
export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;
  await entityService.remove(tenantId, id);
};
```

## Benefícios do Padrão

### Clareza Arquitetural
- **Separação clara**: Contexto vs Dados
- **Legibilidade**: Fácil identificar o tenant
- **Consistência**: Mesmo padrão em toda aplicação

### Facilita Multi-tenancy
- **Isolamento**: Cada tenant tem seus dados
- **Segurança**: Validação de tenant separada
- **Performance**: Otimizações por tenant

### Manutenibilidade
- **Refatoração**: Mudanças no tenant não afetam dados
- **Debug**: Fácil rastrear operações por tenant
- **Testes**: Mock de tenant independente dos dados

## Validação

### No Controller
```typescript
// Validar tenantId nos params
const { tenantId } = ctx.validated.params; // UUID validado pelo schema
```

### No Service
```typescript
// TenantId já validado, usar diretamente
const dbName = await getDBName({ publicUUID: tenantId });
```

## Exceções

### NUNCA há exceções para este padrão
- Todas as funções de service que operam em contexto de tenant devem seguir
- Mesmo para funções internas ou utilitárias
- Mesmo para funções que só leem dados

## Migração de Código Legado

### Se encontrar padrão antigo:
1. **Identifique** a função com padrão incorreto
2. **Refatore** para o padrão correto
3. **Atualize** todos os chamadores
4. **Teste** para garantir funcionamento

### Exemplo de Migração:
```typescript
// ❌ Antes (incorreto)
export const create = async (args: {
  tenantId: string;
  data: AccountCreate;
}): Promise<AccountDocument> => {
  const { tenantId, data } = args;
  // ...
};

// ✅ Depois (correto)
export const create = async (
  tenantId: string,
  data: AccountCreate
): Promise<AccountDocument> => {
  // ...
};
```

## Regras de Ouro

### 1. TenantId sempre primeiro
**Se a função precisa de tenantId, ele SEMPRE vem primeiro, separado dos dados.**

### 2. Parâmetros individuais
**NUNCA agrupe parâmetros em objetos. Cada parâmetro deve ser individual.**

### 3. Ordem dos parâmetros
**Ordem obrigatória: tenantId, id (se necessário), data (se necessário)**

```typescript
// ✅ Correto - ordem dos parâmetros
update(tenantId, id, data)
findById(tenantId, id)
create(tenantId, data)
findByEmail(tenantId, email)
remove(tenantId, id)
```

Estas regras são invioláveis e devem ser seguidas em 100% dos casos.