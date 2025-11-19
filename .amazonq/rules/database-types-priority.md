# Regras de Prioridade de Tipos do Banco de Dados

## Princípio Fundamental

**O BANCO DE DADOS SEMPRE DEFINE OS TIPOS**

O banco de dados é a fonte da verdade para todos os tipos de dados. Todos os outros tipos (schemas, mappers, responses) devem seguir exatamente o que o banco define.

## Hierarquia de Tipos

### 1. **Banco de Dados** (Fonte da Verdade)
- **MongoDB/Mongoose** define os tipos base
- **Campos opcionais** podem ser `null`, `undefined` ou ausentes
- **Tipos primitivos** seguem o que o banco retorna
- **Arrays e objetos** seguem estrutura do banco

### 2. **Models** (Reflexo do Banco)
- **SEMPRE** espelham exatamente os tipos do banco
- **NUNCA** fazem conversões de tipos
- **Mantêm** `null`, `undefined` como o banco define

### 3. **Mappers** (Adaptação Mínima)
- **EVITEM** conversões de tipos ao máximo
- **MANTENHAM** `null` como `null` se o banco retorna `null`
- **CONVERTAM** apenas quando absolutamente necessário
- **DOCUMENTEM** qualquer conversão obrigatória

### 4. **Schemas/Responses** (Seguem o Banco)
- **ACEITEM** os mesmos tipos que o banco retorna
- **NUNCA** forcem conversões desnecessárias
- **USEM** `string | null` se o banco pode retornar `null`

## Regras de Implementação

### ✅ CORRETO - Seguir o Banco
```typescript
// Banco retorna: { description: string | null }
// Model
export interface Role {
  description?: string | null;
}

// Mapper - SEM conversão
export const toResponse = (role: Role) => ({
  description: role.description, // Mantém null se for null
});

// Schema - Aceita o que o banco retorna
export interface RoleResponse {
  description?: string | null;
}
```

### ❌ INCORRETO - Forçar Conversões
```typescript
// Banco retorna: { description: string | null }
// Mapper - conversão desnecessária
export const toResponse = (role: Role) => ({
  description: role.description ?? undefined, // ❌ Conversão forçada
});

// Schema - tipo diferente do banco
export interface RoleResponse {
  description?: string; // ❌ Não aceita null que o banco pode retornar
}
```

## Quando Converter É Permitido

### Conversões Obrigatórias (Raras)
- **APIs externas** que exigem formato específico
- **Padrões de protocolo** (ex: JSON não suporta `undefined`)
- **Compatibilidade** com bibliotecas que não aceitam `null`
- **Validações** que exigem formato específico

### Processo para Conversões
1. **DOCUMENTE** por que a conversão é necessária
2. **MINIMIZE** o escopo da conversão
3. **MANTENHA** conversão o mais próximo possível do ponto de uso
4. **EVITE** conversões em cascata

```typescript
// ✅ Conversão documentada e justificada
export const toExternalAPI = (role: Role) => ({
  // Conversão necessária: API externa não aceita null
  description: role.description ?? '', // Documentado: API exige string
});
```

## Benefícios da Abordagem

### Consistência
- **Tipos uniformes** em toda aplicação
- **Menos bugs** por incompatibilidade de tipos
- **Manutenção fácil** - mudança no banco reflete em tudo

### Performance
- **Sem conversões** desnecessárias
- **Menos processamento** de dados
- **Memória otimizada** - dados passam direto

### Debugging
- **Dados originais** preservados
- **Rastreamento fácil** da origem dos dados
- **Logs consistentes** com o que está no banco

## Exemplos Práticos

### Campo Opcional com Null
```typescript
// Banco: description pode ser null
const schema = new Schema({
  description: { type: String, default: null }
});

// ✅ Model segue o banco
export interface Role {
  description: string | null;
}

// ✅ Mapper mantém null
export const toResponse = (role: Role) => ({
  description: role.description, // null permanece null
});

// ✅ Response aceita null
export interface RoleResponse {
  description: string | null;
}
```

### Array Opcional
```typescript
// Banco: permissions pode ser array vazio ou undefined
const schema = new Schema({
  permissions: { type: [String], default: undefined }
});

// ✅ Todos seguem o banco
export interface Role {
  permissions?: string[];
}

export const toResponse = (role: Role) => ({
  permissions: role.permissions, // undefined permanece undefined
});

export interface RoleResponse {
  permissions?: string[];
}
```

## Migração de Código Existente

### Identificar Conversões Desnecessárias
1. **Encontre** `?? undefined`, `|| null`, conversões similares
2. **Verifique** se o banco realmente retorna o tipo original
3. **Remova** conversão se não for necessária
4. **Ajuste** tipos para aceitar o que o banco retorna

### Processo de Correção
```typescript
// ❌ Antes - conversão desnecessária
description: role.description ?? undefined

// ✅ Depois - tipo correto + sem conversão
// 1. Ajustar interface para aceitar null
interface RoleResponse {
  description?: string | null; // Aceita null
}

// 2. Remover conversão
description: role.description // Mantém como banco retorna
```

## Exceções Documentadas

### Casos Especiais (Raros)
- **Timestamps**: Conversão Date → string para JSON
- **ObjectId**: Conversão para string para APIs
- **Buffers**: Conversão para base64 para transporte

```typescript
// ✅ Exceção documentada
export const toResponse = (role: Role) => ({
  _id: role._id.toString(), // Necessário: ObjectId → string para JSON
  createdAt: role.createdAt.toISOString(), // Necessário: Date → string para JSON
  description: role.description, // Mantém como banco (null/string)
});
```

## Regra de Ouro

**"Se o banco retorna assim, mantenha assim. Converta apenas quando impossível não converter."**

Esta regra garante:
- **Consistência** de tipos em toda aplicação
- **Performance** otimizada sem conversões desnecessárias  
- **Manutenibilidade** - mudanças no banco refletem automaticamente
- **Debugging** mais fácil com dados originais preservados