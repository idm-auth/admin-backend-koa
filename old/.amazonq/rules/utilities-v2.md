# Utilitários - IA Rules

## TRIGGERS AUTOMÁTICOS - IMPORTS

### SE importando do src/
→ **ENTÃO** use `@/` sempre, NUNCA paths relativos

### SE importando do tests/
→ **ENTÃO** use `@test/` sempre, NUNCA paths relativos

### SE usando imports
→ **ENTÃO** use imports estáticos no topo, NUNCA dinâmicos

## TRIGGERS AUTOMÁTICOS - LOGGING

### SE arquivo fora do contexto Koa
→ **ENTÃO** use `import { getLogger } from '@/plugins/pino.plugin';`

### SE arquivo dentro do contexto Koa
→ **ENTÃO** use `import { getLogger } from '@/utils/localStorage.util';`

### SE fazendo log
→ **ENTÃO** use logger, NUNCA console.log/console.error

### SE log com contexto
→ **ENTÃO** use `logger.info({ key: value }, 'mensagem')` - objeto primeiro

### SE log com dados não confiáveis
→ **ENTÃO** use formato estruturado, NUNCA interpolação de strings

## TRIGGERS AUTOMÁTICOS - KOA CONTEXT

### SE acessando dados no controller
→ **ENTÃO** use `ctx.validated`, NUNCA `ctx.params/query/body` direto

### SE fazendo validação no controller
→ **ENTÃO** NUNCA chame validateZod novamente, dados já validados

### SE usando dados validados
→ **ENTÃO** confie no type safety do `ctx.validated`

## AÇÕES OBRIGATÓRIAS

### Imports obrigatórios
```typescript
// ✅ Correto - aliases obrigatórios
import { accountService } from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';

// ❌ Incorreto - paths relativos
import { accountService } from '../../../domains/realms/accounts/account.service';
```

### Logging obrigatório
```typescript
// ✅ Correto - contexto Koa
import { getLogger } from '@/utils/localStorage.util';

// ✅ Correto - fora do contexto Koa
import { getLogger } from '@/plugins/pino.plugin';

// ✅ Correto - formato estruturado
logger.info({ userName }, 'User logged in');

// ❌ Incorreto - interpolação perigosa
logger.info(`User ${userName} logged in`);
```

### Context obrigatório
```typescript
// ✅ Correto - dados validados
export const create = async (ctx: Context) => {
  const data = ctx.validated.body;
  const { id } = ctx.validated.params;
  const query = ctx.validated.query;
};

// ❌ Incorreto - dados não validados
export const create = async (ctx: Context) => {
  const data = ctx.request.body;
  const { id } = ctx.params;
};
```

## GUARDRAILS OBRIGATÓRIOS

### Imports seguros
- **SEMPRE** use aliases `@/` e `@test/`
- **NUNCA** use paths relativos para src/ ou tests/
- **SEMPRE** use imports estáticos no topo

### Logging seguro
- **NUNCA** use console.log/console.error
- **SEMPRE** use formato estruturado para dados não confiáveis
- **SEMPRE** coloque objeto como primeiro parâmetro no Pino

### Context seguro
- **NUNCA** acesse ctx.params/query/body diretamente
- **SEMPRE** use ctx.validated para dados validados
- **NUNCA** faça validação dupla no controller

## PADRÕES DE RECONHECIMENTO

### Imports corretos quando vejo:
- `@/domains/...` para código do src
- `@test/utils/...` para código de testes
- Imports estáticos no topo do arquivo

### Logging correto quando vejo:
- `getLogger()` em vez de console
- `logger.info({ data }, 'message')` formato estruturado
- Import correto baseado no contexto (Koa vs não-Koa)

### Context correto quando vejo:
- `ctx.validated.body` em vez de `ctx.request.body`
- Dados usados diretamente sem revalidação
- Type safety mantido nos dados validados

## REGRA DE OURO

**"Use aliases para imports, formato estruturado para logs, ctx.validated para dados."**