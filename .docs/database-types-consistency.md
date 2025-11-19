# Consistência de Tipos com Banco de Dados

## Filosofia do Projeto

**O banco de dados é a fonte da verdade para todos os tipos de dados.**

Este projeto segue o princípio de que o banco de dados define como os dados devem ser estruturados e tipados em toda a aplicação. Todos os outros componentes (models, mappers, schemas, responses) devem seguir fielmente o que o banco define.

## Hierarquia de Autoridade de Tipos

### 1. MongoDB/Mongoose (Autoridade Máxima)
- Define se campos são obrigatórios ou opcionais
- Define se campos podem ser `null`, `undefined` ou ausentes
- Define tipos primitivos (string, number, boolean, Date)
- Define estruturas de arrays e objetos aninhados

### 2. Models TypeScript (Reflexo Direto)
- Espelham exatamente os tipos definidos no banco
- Não fazem interpretações ou conversões
- Mantêm a mesma opcionalidade e nullability

### 3. Mappers (Adaptação Mínima)
- Preservam os tipos originais do banco
- Fazem apenas conversões absolutamente necessárias
- Documentam qualquer conversão realizada

### 4. Schemas/Responses (Compatibilidade)
- Aceitam os mesmos tipos que o banco produz
- Não forçam conversões nos mappers
- Refletem a realidade dos dados

## Princípios de Implementação

### Preservação de Tipos
```typescript
// ✅ CORRETO - Preserva tipos do banco
// Banco define: description pode ser null
const mongoSchema = new Schema({
  description: { type: String, default: null }
});

// Model preserva exatamente
export interface Role {
  description: string | null;
}

// Mapper não converte
export const toResponse = (role: Role) => ({
  description: role.description, // null permanece null
});

// Response aceita o que vem do banco
export interface RoleResponse {
  description: string | null;
}
```

### Conversões Apenas Quando Necessário
```typescript
// ✅ CORRETO - Conversão documentada e justificada
export const toResponse = (role: Role) => ({
  _id: role._id.toString(), // Necessário: ObjectId não é JSON serializável
  createdAt: role.createdAt.toISOString(), // Necessário: Date → string para JSON
  description: role.description, // Preservado: null permanece null
});
```

### Evitar Conversões Desnecessárias
```typescript
// ❌ INCORRETO - Conversão desnecessária
export const toResponse = (role: Role) => ({
  description: role.description ?? undefined, // Por que converter null → undefined?
});

// ❌ INCORRETO - Forçar tipo diferente do banco
export interface RoleResponse {
  description?: string; // Banco pode retornar null, mas tipo não aceita
}
```

## Benefícios da Abordagem

### 1. Consistência Garantida
- Todos os componentes falam a mesma "linguagem" de tipos
- Mudanças no banco se propagam automaticamente
- Menos bugs por incompatibilidade de tipos

### 2. Performance Otimizada
- Dados fluem sem conversões desnecessárias
- Menos processamento e uso de memória
- Pipelines de dados mais eficientes

### 3. Debugging Simplificado
- Dados mantêm formato original do banco
- Logs mostram exatamente o que está armazenado
- Rastreamento de problemas mais direto

### 4. Manutenibilidade
- Mudanças no schema do banco refletem automaticamente
- Menos código de conversão para manter
- Evolução do schema mais previsível

## Casos de Uso Comuns

### Campo Opcional com Null
```typescript
// MongoDB Schema
const schema = new Schema({
  description: { type: String, default: null }
});

// ✅ Implementação correta em toda stack
export interface Role {
  description: string | null; // Aceita null como banco define
}

export const toResponse = (role: Role) => ({
  description: role.description, // Não converte null
});

export interface RoleResponse {
  description: string | null; // API pode retornar null
}
```

### Array Opcional
```typescript
// MongoDB Schema
const schema = new Schema({
  permissions: { type: [String], default: undefined }
});

// ✅ Stack completa consistente
export interface Role {
  permissions?: string[]; // undefined quando não definido
}

export const toResponse = (role: Role) => ({
  permissions: role.permissions, // undefined permanece undefined
});

export interface RoleResponse {
  permissions?: string[]; // Pode ser undefined
}
```

### Campos com Valores Padrão
```typescript
// MongoDB Schema
const schema = new Schema({
  isActive: { type: Boolean, default: true }
});

// ✅ Todos seguem o padrão do banco
export interface User {
  isActive: boolean; // Sempre presente devido ao default
}

export const toResponse = (user: User) => ({
  isActive: user.isActive, // boolean direto
});

export interface UserResponse {
  isActive: boolean; // Sempre boolean
}
```

## Exceções Permitidas

### Conversões Obrigatórias
Apenas em casos onde é tecnicamente impossível manter o tipo original:

1. **ObjectId → String**: Para serialização JSON
2. **Date → String**: Para transporte via JSON
3. **Buffer → Base64**: Para APIs REST
4. **Números especiais**: NaN, Infinity para JSON

```typescript
// ✅ Exceções documentadas
export const toResponse = (entity: Entity) => ({
  _id: entity._id.toString(), // ObjectId não é JSON-safe
  createdAt: entity.createdAt.toISOString(), // Date → ISO string
  data: entity.data, // Outros campos preservados
});
```

### APIs Externas
Quando integração com sistemas externos exige formato específico:

```typescript
// ✅ Conversão para API externa específica
export const toExternalAPI = (role: Role) => ({
  // API externa não aceita null, exige string vazia
  description: role.description ?? '', // Documentado: requisito da API
});
```

## Migração de Código Existente

### Identificar Problemas
1. Procurar por conversões desnecessárias: `?? undefined`, `|| null`
2. Verificar incompatibilidades de tipos entre camadas
3. Encontrar mappers que alteram tipos sem necessidade

### Processo de Correção
1. **Verificar** o que o banco realmente retorna
2. **Ajustar** tipos para aceitar dados do banco
3. **Remover** conversões desnecessárias
4. **Documentar** conversões que devem permanecer

### Exemplo de Migração
```typescript
// ❌ Antes - tipos inconsistentes
interface RoleResponse {
  description?: string; // Não aceita null
}

export const toResponse = (role: Role) => ({
  description: role.description ?? undefined, // Conversão forçada
});

// ✅ Depois - consistente com banco
interface RoleResponse {
  description: string | null; // Aceita null como banco
}

export const toResponse = (role: Role) => ({
  description: role.description, // Sem conversão
});
```

## Ferramentas de Validação

### TypeScript Strict Mode
Use `--strict` para detectar incompatibilidades:
```bash
npm run type-check # Detecta problemas de tipos
```

### Testes de Integração
Valide que dados fluem corretamente:
```typescript
it('should preserve null values from database', async () => {
  const role = await createRoleWithNullDescription();
  const response = roleMapper.toResponse(role);
  expect(response.description).toBe(null); // null preservado
});
```

## Regras de Code Review

### Checklist para PRs
- [ ] Tipos seguem exatamente o que o banco define?
- [ ] Conversões são apenas quando tecnicamente necessárias?
- [ ] Conversões obrigatórias estão documentadas?
- [ ] Testes validam preservação de tipos?
- [ ] Não há `?? undefined` ou `|| null` desnecessários?

### Red Flags
- Conversões sem justificativa técnica
- Tipos diferentes entre model e response
- Mappers que "corrigem" dados do banco
- Schemas que não aceitam o que o banco produz

## Conclusão

Esta abordagem garante que o projeto mantenha consistência de tipos em toda a stack, reduzindo bugs, melhorando performance e facilitando manutenção. O banco de dados, como fonte da verdade, define como todos os dados devem ser tratados em toda a aplicação.