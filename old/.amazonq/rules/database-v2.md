# Database - IA Rules

## TRIGGERS AUTOMÁTICOS - MODELOS

### SE definindo _id customizado
→ **ENTÃO** use `{ type: String, default: uuidv4 }`, NUNCA `_id: false`

### SE criando índice MongoDB
→ **ENTÃO** use field-level quando possível, schema-level apenas para nested/compound

### SE índice é em campo top-level
→ **ENTÃO** use `{ index: true }` ou `{ unique: true, index: true }` no campo

### SE índice é em campo nested ou compound
→ **ENTÃO** use `schema.index()` após definição do schema

### SE criando subdocument
→ **ENTÃO** use `_id: false` APENAS em embedded schemas

### SE criando referência entre modelos
→ **ENTÃO** use String para UUIDs, NUNCA ObjectId + ref

### SE precisando populate
→ **ENTÃO** implemente manualmente, String + ref não funciona

### SE estendendo schema base
→ **ENTÃO** use `schema.add(baseDocumentSchema)`

### SE criando tipos do modelo
→ **ENTÃO** use padrão `{Entity}Schema` → `{Entity}` → `{Entity}Create`

## TRIGGERS AUTOMÁTICOS - TIPOS

### SE banco retorna null
→ **ENTÃO** mantenha null em todos os tipos, não converta

### SE banco retorna undefined
→ **ENTÃO** mantenha undefined em todos os tipos, não converta

### SE considerando conversão de tipo
→ **ENTÃO** documente por que é obrigatória, evite ao máximo

### SE mapper recebe dados do banco
→ **ENTÃO** passe dados como estão, sem conversões desnecessárias

## TRIGGERS AUTOMÁTICOS - NOMENCLATURA

### SE nomeando collection
→ **ENTÃO** use sempre minúscula + hífen para múltiplas palavras: `account-groups`, `accounts`

### SE nomeando collection
→ **ENTÃO** corresponda ao diretório do domínio

## AÇÕES OBRIGATÓRIAS

### Índices MongoDB (Ver: .docs/database-indexes.md)
```typescript
// ✅ Correto - field-level para campos simples
const schema = new mongoose.Schema({
  name: { type: String, index: true },
  email: { type: String, unique: true, index: true },
});

// ✅ Correto - schema-level apenas para nested/compound
schema.index({ 'user.profile.email': 1 });
schema.index({ lastName: 1, firstName: 1 }); // compound

// ❌ Incorreto - duplicação
email: { type: String, index: true },
schema.index({ email: 1 }); // DUPLICADO!
```

### UUID como _id obrigatório
```typescript
// ✅ Correto
const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: String,
});

// ❌ Incorreto - conflito
const schema = new Schema({
  _id: { type: String, default: uuidv4 },
}, { _id: false }); // CONFLITO!
```

### Referências com String
```typescript
// ✅ Correto - compatível com UUID
const schema = new Schema({
  accountId: { type: String, required: true },
  groupId: { type: String, required: true },
});

// ✅ Populate manual quando necessário
const accountGroups = await AccountGroupModel.find({ accountId });
const groupIds = accountGroups.map(ag => ag.groupId);
const groups = await GroupModel.find({ _id: { $in: groupIds } });
```

### Tipos seguem o banco
```typescript
// ✅ Correto - seguir o banco
// Banco retorna: { description: string | null }
export interface Role {
  description?: string | null;
}

export const toResponse = (role: Role) => ({
  description: role.description, // Mantém null se for null
});

// ❌ Incorreto - conversão forçada
export const toResponse = (role: Role) => ({
  description: role.description ?? undefined, // Conversão desnecessária
});
```



## GUARDRAILS OBRIGATÓRIOS

### Tipos do banco são fonte da verdade
- **BANCO DEFINE TODOS OS TIPOS** - fonte da verdade absoluta
- **EVITAR conversões** desnecessárias ao máximo
- **MANTER null como null** se o banco retorna null
- **CONVERTER apenas** quando impossível não converter

## PADRÕES DE RECONHECIMENTO

### UUID correto quando vejo:
- `_id: { type: String, default: uuidv4 }`
- Referências usando String, não ObjectId
- Populate implementado manualmente

### Tipos corretos quando vejo:
- Tipos mantêm null/undefined como banco retorna
- Mappers passam dados sem conversão
- Conversões apenas quando documentadas como obrigatórias

### Nomenclatura correta quando vejo:
- Collections com hífen: `account-groups`
- Correspondência com estrutura de domínios
- Padrão kebab-case consistente

## REGRA DE OURO

**"Se o banco retorna assim, mantenha assim. Converta apenas quando impossível não converter."**

**"Se o domínio tem múltiplas palavras, a collection DEVE usar hífen para separá-las."**