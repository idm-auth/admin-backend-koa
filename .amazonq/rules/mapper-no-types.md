# Regras para Mappers - Sem Tipos Próprios

## Princípio Fundamental

**MAPPERS NÃO DEVEM DEFINIR TIPOS**

Mappers são responsáveis apenas por transformar dados. Todos os tipos devem estar definidos nos schemas correspondentes.

## Regras Obrigatórias

### ❌ PROIBIDO - Definir tipos no mapper
```typescript
// ❌ INCORRETO - Mapper com tipos próprios
// role.mapper.ts
export interface RoleResponse {
  _id: string;
  name: string;
}

export const toResponse = (role: RoleDocument): RoleResponse => ({
  _id: role._id.toString(),
  name: role.name,
});
```

### ✅ OBRIGATÓRIO - Importar tipos do schema
```typescript
// ✅ CORRETO - Mapper sem tipos próprios
// role.mapper.ts
import { RoleDocument } from './role.model';
import { RoleBaseResponse } from './role.schema';

export const toResponse = (role: RoleDocument): RoleBaseResponse => ({
  _id: role._id.toString(),
  name: role.name,
});
```

## Estrutura Correta

### Schema define os tipos
```typescript
// role.schema.ts
export const roleBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().nullable().optional(),
});

export type RoleBaseResponse = z.infer<typeof roleBaseResponseSchema>;
```

### Mapper usa os tipos do schema
```typescript
// role.mapper.ts
import { RoleDocument } from './role.model';
import { RoleBaseResponse } from './role.schema';

export const toResponse = (role: RoleDocument): RoleBaseResponse => ({
  _id: role._id.toString(),
  name: role.name,
  description: role.description,
});
```

## Responsabilidades Claras

### Schema (.schema.ts)
- **Define** todos os tipos de request e response
- **Valida** estrutura de dados com Zod
- **Exporta** tipos TypeScript derivados dos schemas Zod
- **Centraliza** definições de tipos do domínio

### Mapper (.mapper.ts)
- **Transforma** dados entre camadas
- **Importa** tipos do schema
- **NÃO define** tipos próprios
- **Foca** apenas na lógica de transformação

### Model (.model.ts)
- **Define** estrutura do banco de dados
- **Exporta** tipos de documento do Mongoose
- **Configura** schemas do MongoDB

## Benefícios da Separação

### Consistência
- **Tipos centralizados** no schema
- **Única fonte da verdade** para estruturas de dados
- **Evita duplicação** de definições de tipos

### Manutenibilidade
- **Mudanças** apenas no schema se propagam automaticamente
- **Mappers** focam apenas na lógica de transformação
- **Menos arquivos** para atualizar quando tipos mudam

### Clareza
- **Responsabilidades bem definidas** por arquivo
- **Fácil localização** de tipos (sempre no schema)
- **Código mais limpo** nos mappers

## Migração de Código Existente

### Identificar Mappers com Tipos
```bash
# Buscar mappers que exportam tipos
find src -name "*.mapper.ts" -exec grep -l "export interface\|export type" {} \;
```

### Processo de Correção
1. **Mover** tipos do mapper para o schema correspondente
2. **Adicionar** import do tipo no mapper
3. **Remover** definição de tipo do mapper
4. **Verificar** se outros arquivos importam do mapper e corrigir

### Exemplo de Migração
```typescript
// ❌ Antes - Mapper com tipo
// role.mapper.ts
export interface RoleResponse {
  _id: string;
  name: string;
}

// ✅ Depois - Tipo no schema
// role.schema.ts
export const roleBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
});
export type RoleBaseResponse = z.infer<typeof roleBaseResponseSchema>;

// role.mapper.ts
import { RoleBaseResponse } from './role.schema';
```

## Validação

### Checklist para Code Review
- [ ] Mapper não exporta `interface` ou `type`?
- [ ] Todos os tipos usados são importados do schema?
- [ ] Schema contém todos os tipos necessários?
- [ ] Não há duplicação de tipos entre mapper e schema?

### Comando de Verificação
```bash
# Verificar se há mappers com tipos próprios
find src -name "*.mapper.ts" -exec grep -l "export interface\|export type" {} \; | wc -l
# Resultado deve ser 0
```

## Exceções

### NUNCA há exceções
- **Todos os mappers** devem seguir esta regra
- **Sem exceções** para casos especiais
- **Tipos auxiliares** também devem estar no schema

## Regra de Ouro

**"Mappers transformam, schemas definem. Cada um com sua responsabilidade."**

Esta separação garante:
- **Código mais organizado** e fácil de manter
- **Tipos centralizados** e consistentes
- **Responsabilidades claras** entre arquivos
- **Evolução controlada** dos tipos de dados