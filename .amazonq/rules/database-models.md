# Regras para Modelos de Banco de Dados

## IDs e Identificadores

### UUID como _id
- **SEMPRE use UUID como String para _id**
- Use `default: uuidv4` (sem arrow function)
- **NUNCA use `_id: false`** quando definindo _id customizado

```typescript
// ✅ Correto
const schema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: String,
});

// ❌ Incorreto - conflito
const schema = new Schema({
  _id: { type: String, default: uuidv4 },
}, { _id: false }); // CONFLITO!
```

### Quando usar _id: false
- **APENAS em subdocuments/embedded schemas**
- Quando você NÃO quer _id no subdocumento

```typescript
// ✅ Correto - subdocument
const addressSchema = new Schema({
  street: String,
  city: String,
}, { _id: false });

const userSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  addresses: [addressSchema], // Endereços sem _id próprio
});
```

## Referências entre Modelos

### Use String para referências com UUID
- **SEMPRE use String para referenciar documentos UUID**
- ObjectId não funciona com UUIDs (formato incompatível)
- **String + ref NÃO funciona para populate** - populate ignora referências String
- Populate deve ser implementado manualmente

```typescript
// ✅ Correto - compatível com UUID
const schema = new Schema({
  accountId: { type: String, required: true },
  groupId: { type: String, required: true },
});

// ❌ Não funciona - populate ignora String + ref
const schema = new Schema({
  accountId: { type: String, ref: 'accounts', required: true },
});
const result = await Model.find().populate('accountId'); // Não popula

// ✅ Populate manual quando necessário
const accountGroups = await AccountGroupModel.find({ accountId });
const groupIds = accountGroups.map(ag => ag.groupId);
const groups = await GroupModel.find({ _id: { $in: groupIds } });
```

### ObjectId apenas para sistemas nativos
- **Use ObjectId + ref apenas se usar ObjectId como _id**
- Não compatível com sistema UUID atual

```typescript
// ❌ Não funciona com UUID como _id
const schema = new Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts' },
}); // Erro: UUID não é ObjectId válido
```

## Base Schema

### Herança de BaseDocument
- **SEMPRE estenda baseDocumentSchema**
- Use `schema.add(baseDocumentSchema)` para herdar campos base
- Inclui: _id (UUID), createdAt, updatedAt

### Padrão de Tipos Intermediários
- **SEMPRE crie tipo Schema intermediário** antes do BaseDocument
- **Use padrão**: `{Entity}Schema` → `{Entity}` → `{Entity}Create`
- Facilita criação de tipos derivados sem repetir campos do BaseDocument

```typescript
// ✅ Correto - Padrão com tipo intermediário
export const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});
schema.add(baseDocumentSchema);

// Tipo intermediário (apenas schema específico)
export type UserSchema = InferSchemaType<typeof schema>;
// Tipo completo (schema + BaseDocument)
export type User = UserSchema & BaseDocument;
// Tipo para criação (baseado no schema, não no tipo completo)
export type UserCreate = Omit<UserSchema, 'fieldsWithDefaults'> & {
  fieldsWithDefaults?: OptionalType;
};
```

## Índices

### Índices Únicos
- Use índices únicos para prevenir duplicatas
- Combine campos quando necessário

```typescript
// ✅ Índice único simples
schema.index({ email: 1 }, { unique: true });

// ✅ Índice único composto
schema.index({ accountId: 1, groupId: 1 }, { unique: true });
```

### Índices de Performance
- Adicione índices para campos de busca frequente
- Considere índices compostos para queries complexas

```typescript
// ✅ Índices de busca
schema.index({ accountId: 1 });
schema.index({ groupId: 1 });
schema.index({ createdAt: -1 });
```

## Vantagens do UUID como String

### Por que usar UUID em vez de ObjectId
- ✅ **Universalidade**: Funciona em qualquer banco
- ✅ **Legibilidade**: Fácil debug e logs
- ✅ **Integração**: APIs externas compatíveis
- ✅ **Migração**: Facilita mudança de banco
- ✅ **Consistência**: Formato único em toda aplicação

### Quando considerar ObjectId
- Performance crítica com milhões de documentos
- Necessidade de features específicas do MongoDB
- Restrições de tamanho (ObjectId: 12 bytes vs UUID: 36 bytes)

