# Regras para Testes Unitários

## Arquitetura de Testes Unitários

### Estrutura Obrigatória
- **SEMPRE organize por versão**: `tests/unit/domains/{contexto}/{dominio}/v1/`
- **NUNCA use `latest/`** - sempre `v1/` para testes unitários
- **Divida por responsabilidade**: `service/`, `model/`, `mapper/`, `schema/`
- **Um arquivo por função**: Cada função testada tem seu próprio arquivo

### Estrutura de Diretórios
```
tests/unit/domains/{contexto}/{dominio}/v1/
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
- **Model**: `schema.test.ts` para estrutura do schema
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
- **Teste comportamento real, não mocks artificiais**
- Use mocks apenas quando absolutamente necessário
- Prefira dados reais a retornos mockados
- Valide o resultado, não apenas se a função foi chamada
- **Aproveite o MongoDB em memória** para testes mais realistas

## Quando NÃO usar mocks
- **NUNCA** mocke apenas para forçar um retorno específico
- **NUNCA** use `mockReturnValueOnce()` sem necessidade real
- **NUNCA** mocke bibliotecas que podem ser testadas diretamente
- **NUNCA** mocke para "facilitar" o teste
- **NUNCA** use prefixo "mock" para dados de teste - veja `mocks-and-testing.md`

## Quando usar mocks
- Dependências externas (APIs, banco de dados em alguns casos)
- Operações custosas (filesystem, rede)
- Comportamentos não determinísticos (datas, random)
- Bibliotecas de criptografia (bcrypt, jwt)
- **SEMPRE use sufixo "Mock" apenas para mocks reais** - veja `mocks-and-testing.md`

## Exemplos por Tipo

### Service Tests

#### Teste com Banco Real (Preferido)
```typescript
// service/create.test.ts
import { describe, expect, it } from 'vitest';
import { ValidationError } from '@/errors/validation';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
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

#### Teste com Mock (Apenas para Dependências Externas)
```typescript
// service/comparePassword.test.ts
import { describe, expect, it } from 'vitest';
import bcrypt from 'bcrypt';
import * as accountService from '@/domains/realms/accounts/v1/account.service';

describe('account.service.comparePassword', () => {
  it('should return true for matching password', async () => {
    const plainPassword = 'test-password';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const account = { _id: 'account-id', password: hashedPassword } as any;
    
    const result = await accountService.comparePassword(account, plainPassword);
    
    expect(result).toBe(true);
  });
});
```

### Model Tests
```typescript
// model/schema.test.ts
import { describe, expect, it } from 'vitest';
import { schema } from '@/domains/realms/accounts/v1/account.model';

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
import * as accountMapper from '@/domains/realms/accounts/v1/account.mapper';

describe('account.mapper.toCreateResponse', () => {
  it('should return primary email when exists', () => {
    const account = { _id: 'test', emails: [{ email: 'test@example.com', isPrimary: true }] };
    const result = accountMapper.toCreateResponse(account);
    expect(result.email).toBe('test@example.com');
  });
});
```

## Validações
- Sempre valide propriedades específicas do resultado
- Use `toHaveProperty()` para verificar estrutura
- Teste cenários de sucesso E erro
- Verifique tipos de retorno quando relevante

### Controller Tests
```typescript
// controller/create.test.ts
import { describe, expect, it } from 'vitest';
import { Context } from 'koa';
import * as accountController from '@/domains/realms/accounts/v1/account.controller';
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

## Benefícios da Nova Arquitetura
- **Organização clara** por responsabilidade
- **Fácil navegação** - Um arquivo por função
- **Manutenibilidade** - Mudanças isoladas
- **Consistência** - Padrão único em todo projeto
- **Cobertura completa** - Controllers, services, mappers e models