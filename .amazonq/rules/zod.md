# Zod Configuration Rules

## Version
- **SEMPRE use Zod v4** - não use versões anteriores
- Verifique se está instalado: `npm list zod`
- Se necessário, atualize: `npm install zod@^4.0.0`

## Import Obrigatório
- **SEMPRE use APENAS**: `import { z } from 'zod';`
- **NUNCA** use `import z from 'zod'` (default import)
- **NUNCA** use outras formas de import
- **REGRA AUTOMÁTICA**: Qualquer import diferente deve ser corrigido automaticamente para `import { z } from 'zod';`

## extendZodWithOpenApi Obrigatório
- **SEMPRE adicione** `extendZodWithOpenApi(z);` após importar o Zod
- **OBRIGATÓRIO** em todos os arquivos que usam schemas Zod
- Deve vir logo após os imports:
```typescript
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
```

## Zod v4 Syntax

### Tipos Básicos
```typescript
// String
z.string()                                    // string simples
z.string({ error: 'Field is required' })      // com mensagem de erro

// Email
z.email({
  pattern: z.regexes.rfc5322Email,
  error: (issue) => 
    issue.input === undefined || issue.input === ''
      ? 'Email is required'
      : 'Invalid email format',
})

// UUID
z.uuidv4('Invalid ID')                        // UUID v4

// Object
z.object({
  field: z.string(),
})
```

### Validações
```typescript
// String com validações
z.string()
  .min(8, 'Must be at least 8 characters')
  .max(100, 'Must be at most 100 characters')
  .regex(/pattern/, 'Must match pattern')

// Opcional
z.string().optional()

// Com default
z.string().default('default value')
```

## Validation Messages
- Sempre em inglês
- Mensagens claras e específicas
- Diferencie entre campo obrigatório e formato inválido

## Password Validation
- Siga diretrizes OWASP
- Mínimo 8 caracteres
- Pelo menos: 1 minúscula, 1 maiúscula, 1 número, 1 caractere especial

```typescript
z.string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
```

## Schemas Reutilizáveis
- Sempre importe de `@/schemas/latest/base.schema` quando disponível
- Exemplos: `DocIdSchema`, `emailSchema`, `passwordSchema`, `publicUUIDSchema`