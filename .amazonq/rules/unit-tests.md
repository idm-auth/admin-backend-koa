# Regras para Testes Unitários

## Arquitetura de Testes Unitários

### Estrutura Obrigatória
- **Organize por domínio**: `tests/unit/domains/{contexto}/{dominio}/`
- **Divida por responsabilidade**: `controller/`, `service/`, `mapper/`, `model/`
- **Um arquivo por função/funcionalidade**: Cada função ou funcionalidade testada tem seu próprio arquivo

### Estrutura de Diretórios
```
tests/unit/domains/{contexto}/{dominio}/
├── controller/
│   ├── create.test.ts
│   ├── findById.test.ts
│   ├── update.test.ts
│   └── remove.test.ts
├── service/
│   ├── create.test.ts
│   ├── findById.test.ts
│   ├── update.test.ts
│   └── remove.test.ts
├── model/
│   └── schema.test.ts
├── mapper/
│   ├── toCreateResponse.test.ts
│   ├── toUpdateResponse.test.ts
│   └── toListItemResponse.test.ts
└── schema/
    ├── createSchema.test.ts
    └── updateSchema.test.ts
```

### Nomenclatura de Arquivos
- **Controller**: `{funcaoDoController}.test.ts` (ex: `create.test.ts`, `findById.test.ts`)
- **Service**: `{funcaoDoService}.test.ts` (ex: `findById.test.ts`, `comparePassword.test.ts`)
- **Model**: `{funcionalidade}.test.ts` (ex: `schema.test.ts`, `pre-save.test.ts`)
- **Mapper**: `{funcaoDoMapper}.test.ts` (ex: `toCreateResponse.test.ts`)
- **Schema**: `{nomeDoSchema}.test.ts` (ex: `createSchema.test.ts`)

## Setup de Banco de Dados

### MongoDB em Memória Disponível
- **TODOS os testes unitários têm acesso a MongoDB em memória**
- Setup automático via `tests/setup/base.setup.ts`
- MongoMemoryServer é iniciado no `beforeAll` global
- Conexão disponível através de `initMainConnection(mongo.getUri())`
- **Você PODE usar banco de dados real em testes unitários**

### Helper getTenantId para Testes
- **OBRIGATÓRIO para testes com realms**: Use `getTenantId()` para obter tenant válido
- **Cria realm automaticamente**: Se não existir, cria um novo no banco em memória
- **Retorna publicUUID**: ID do tenant para usar nas funções de service
- **Isolamento de testes**: Cada teste deve usar nome único de tenant

```typescript
import { getTenantId } from '@test/utils/tenant.util';

// Cada teste usa nome único para isolamento
const tenantId = await getTenantId('test-account-create-unique');
```

### Quando Usar Banco vs Mock
- **Use banco real**: Para testar lógica de negócio com persistência
- **Use mocks**: Apenas para dependências externas (APIs, filesystem)
- **Evite mocks desnecessários**: Se o banco está disponível, use-o
- **SEMPRE use getTenantId**: Para qualquer teste que envolva realms/tenants

## Princípios Gerais
- **1 arquivo por função/funcionalidade** - Princípio fundamental
- **Teste comportamento real, não mocks artificiais**
- Use mocks apenas quando absolutamente necessário
- Prefira dados reais a retornos mockados
- Valide o resultado, não apenas se a função foi chamada
- **Aproveite o MongoDB em memória** para testes mais realistas
- **Testes de validação no arquivo da função específica**

## Imports nos Testes
- **Imports diretos** para o domínio
- Use paths absolutos para imports entre domínios

```typescript
// ✅ Correto - import direto
import * as accountService from '@/domains/realms/accounts/account.service';

// ✅ Correto - import entre domínios
import * as groupService from '@/domains/realms/groups/group.service';
```

## Exemplos por Tipo

### Service Tests

#### Teste com Banco Real (Preferido)
```typescript
// service/create.test.ts
import { describe, expect, it } from 'vitest';
import { ValidationError } from '@/errors/validation';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.create', () => {
  it('should throw ValidationError for duplicate email', async () => {
    // OBRIGATÓRIO: getTenantId cria realm no banco em memória
    const tenantId = await getTenantId('test-account-create-duplicate');
    const email = `test-${uuidv4()}@example.com`;
    
    // Criar primeira conta
    await accountService.create(tenantId, {
      email,
      password: 'Password123!',
    });

    // Tentar criar segunda conta com mesmo email
    await expect(
      accountService.create(tenantId, {
        email,
        password: 'Password123!',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should create account successfully', async () => {
    // Cada teste usa nome único para isolamento
    const tenantId = await getTenantId('test-account-create-success');
    const email = `test-${uuidv4()}@example.com`;
    
    const account = await accountService.create(tenantId, {
      email,
      password: 'Password123!',
    });
    
    expect(account).toHaveProperty('_id');
    expect(account.emails[0].email).toBe(email);
    expect(account.emails[0].isPrimary).toBe(true);
  });
});
```

### Model Tests
```typescript
// model/schema.test.ts
import { describe, expect, it } from 'vitest';
import { schema } from '@/domains/realms/accounts/account.model';

describe('account.model.schema', () => {
  it('should have required fields defined', () => {
    const paths = schema.paths;
    expect(paths).toHaveProperty('_id');
    expect(paths).toHaveProperty('emails');
  });
});
```

### Mapper Tests
```typescript
// mapper/toCreateResponse.test.ts
import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/account.mapper';

describe('account.mapper.toCreateResponse', () => {
  it('should return primary email when exists', () => {
    const account = { _id: 'test', emails: [{ email: 'test@example.com', isPrimary: true }] };
    const result = accountMapper.toCreateResponse(account);
    expect(result.email).toBe('test@example.com');
  });
});
```

### Controller Tests
```typescript
// controller/create.test.ts
import { describe, expect, it } from 'vitest';
import { Context } from 'koa';
import * as accountController from '@/domains/realms/accounts/account.controller';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.controller.create', () => {
  it('should create account successfully', async () => {
    const tenantId = await getTenantId('test-controller-create');
    
    const ctx = {
      validated: {
        params: { tenantId },
        body: { 
          email: `controller-${uuidv4()}@example.com`, 
          password: 'Password123!' 
        },
      },
      status: 0,
      body: null,
    } as unknown as Context;
    
    await accountController.create(ctx);
    
    expect(ctx.status).toBe(201);
    expect(ctx.body).toHaveProperty('_id');
    expect(ctx.body).toHaveProperty('email');
    expect(ctx.body).not.toHaveProperty('password');
  });
});
```

## Validações
- Sempre valide propriedades específicas do resultado
- Use `toHaveProperty()` para verificar estrutura
- Teste cenários de sucesso E erro
- Verifique tipos de retorno quando relevante

## Benefícios da Arquitetura Simplificada
- **Organização clara** por responsabilidade
- **Fácil navegação** - Um arquivo por função
- **Manutenibilidade** - Mudanças isoladas
- **Consistência** - Padrão único em todo projeto
- **Cobertura completa** - Controllers, services, mappers e models
- **Imports diretos** - Sem complexidade desnecessária