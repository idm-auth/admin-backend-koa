# Validação e Tipos - IA Rules

## TRIGGERS AUTOMÁTICOS - ZOD

### SE importando Zod
→ **ENTÃO** use APENAS `import { z } from 'zod';`

### SE usando Zod em arquivo
→ **ENTÃO** adicione `extendZodWithOpenApi(z);` após imports

### SE criando email schema
→ **ENTÃO** use `z.email()` com configuração completa, NUNCA `z.string().email()`

### SE criando password schema
→ **ENTÃO** use validações OWASP completas (8+ chars, maiúscula, minúscula, número, especial)

### SE usando UUID
→ **ENTÃO** use `z.uuidv4('Invalid ID')`

## TRIGGERS AUTOMÁTICOS - TYPESCRIPT

### SE definindo tipo
→ **ENTÃO** use declaração `const user: User = {...}`, evite cast `as User`

### SE encontrando `any`
→ **ENTÃO** substitua por tipo específico ou `unknown`

### SE considerando cast `as Type`
→ **ENTÃO** pare e use declaração de tipo `const data: Type = {...}` em vez de cast

### SE cast parece necessário
→ **ENTÃO** pergunte supervisão - provavelmente há alternativa melhor

### SE definindo objeto complexo
→ **ENTÃO** use `interface`, para unions use `type`

### SE criando tipo para request/response
→ **ENTÃO** coloque no arquivo `.schema.ts` correspondente

### SE criando tipo para banco de dados
→ **ENTÃO** coloque no arquivo `.model.ts` correspondente

### SE criando tipo local em função
→ **ENTÃO** use apenas para args/params da própria função, nunca para entidades

### SE tipo pode ser reutilizado
→ **ENTÃO** mova para `.schema.ts` ou `.model.ts`, não deixe local

### SE criando mapper
→ **ENTÃO** NUNCA defina tipos no mapper, importe do schema

### SE mapper exporta interface/type
→ **ENTÃO** mova tipo para schema correspondente

## TRIGGERS AUTOMÁTICOS - TYPE CHECKING

### SE executando validação
→ **ENTÃO** use sequência: `lint:fix` → `type-check` → `test`

### SE `npm run type-check` mostra erro
→ **ENTÃO** corrija TODOS os erros antes de continuar

### SE encontrando erro de tipo
→ **ENTÃO** NUNCA ignore com `@ts-ignore`, corrija o tipo

### SE função sem return explícito
→ **ENTÃO** adicione return em todos os caminhos

## AÇÕES OBRIGATÓRIAS

### Zod v4 obrigatório
- **SEMPRE** use Zod v4, nunca versões anteriores
- **Import obrigatório**: `import { z } from 'zod';`
- **extendZodWithOpenApi** obrigatório em todos os arquivos Zod

### Zod v4 syntax
```typescript
// ✅ Email correto
z.email({
  pattern: z.regexes.rfc5322Email,
  error: (issue) => 
    issue.input === undefined || issue.input === ''
      ? 'Email is required'
      : 'Invalid email format',
})

// ✅ Password OWASP
z.string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
```

### TypeScript obrigatório
- **NUNCA** use `any` - sempre tipo específico ou `unknown`
- **Declaração de tipo** preferível a cast: `const user: User = {...}`
- **async/await** em vez de Promises
- **Optional chaining** (?.) e **nullish coalescing** (??)

### Type checking obrigatório
- **Script obrigatório**: `"type-check": "npx tsc --noEmit --strict"`
- **ZERO ERROS** permitidos - tolerância absoluta zero
- **Sequência obrigatória**: lint:fix → type-check → test

### Mappers sem tipos próprios
- **MAPPERS NÃO DEVEM DEFINIR TIPOS** - apenas transformar dados
- **IMPORTAR tipos do schema** correspondente
- **SCHEMAS definem todos os tipos** de request/response
- **ZERO exceções** - regra inviolável

## GUARDRAILS OBRIGATÓRIOS

### Zod imports
- **NUNCA** use `import z from 'zod'` (default import)
- **SEMPRE** corrija automaticamente para `import { z } from 'zod';`

### TypeScript rigoroso
- **NUNCA** ignore erros de tipo
- **NUNCA** use `@ts-ignore` sem justificativa extrema
- **SEMPRE** tipifique parâmetros e retornos
- **SEMPRE** trate casos null/undefined

### Type checking tolerância zero
- **NUNCA** aceite "só tem 1 erro de tipo"
- **NUNCA** aceite "é só um warning"
- **NUNCA** aceite "funciona mesmo com erro"
- **SEMPRE** corrija TODOS os erros antes de continuar

### Mappers sem tipos
- **NUNCA** defina tipos em mappers
- **SEMPRE** importe tipos do schema
- **NUNCA** faça exceções para casos especiais
- **SEMPRE** mova tipos para schema quando necessário

## PADRÕES DE RECONHECIMENTO

### Zod v4 correto quando vejo:
- `z.email()` com configuração completa
- `z.uuidv4()` para UUIDs
- `extendZodWithOpenApi(z);` após imports
- Mensagens de erro em inglês e específicas

### TypeScript correto quando vejo:
- Declaração de tipo em vez de cast
- Interfaces para objetos, types para unions
- Tratamento explícito de null/undefined
- async/await em vez de Promises

### Type checking correto quando vejo:
- `npm run type-check` sem nenhuma saída
- Todos os erros corrigidos antes de continuar
- Sequência de validação respeitada

## REGRA DE OURO

**Se `npm run type-check` mostra qualquer erro, o código NÃO está pronto**

**Zero erros de tipo = Código aprovado para uso**