# Regras de Imports

## Aliases Obrigatórios

### Para conteúdo do src/
- **SEMPRE use `@/`** para imports do diretório `src/`
- **NUNCA use paths relativos** para código do src

```typescript
// ✅ Correto
import { accountService } from '@/domains/realms/accounts/v1/account.service';
import { NotFoundError } from '@/errors/not-found';
import { getLogger } from '@/utils/localStorage.util';

// ❌ Incorreto
import { accountService } from '../../../domains/realms/accounts/v1/account.service';
import { NotFoundError } from '../../../../errors/not-found';
```

### Para conteúdo do tests/
- **SEMPRE use `@test/`** para imports do diretório `tests/`
- **NUNCA use paths relativos** para código de testes

```typescript
// ✅ Correto
import { getTenantId } from '@test/utils/tenant.util';

// ❌ Incorreto
import { getTenantId } from '../../../../../utils/tenant.util';
import { getTenantId } from '@/tests/utils/tenant.util';
```

## Configuração no tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@test/*": ["tests/*"]
    }
  }
}
```

## Benefícios
- **Legibilidade**: Imports claros e concisos
- **Manutenibilidade**: Fácil refatoração de estruturas
- **Consistência**: Padrão único em todo projeto
- **Navegação**: Fácil localização de arquivos no IDE