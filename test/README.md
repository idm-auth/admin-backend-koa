# Guia de Testes de Integração

## Visão Geral

Este projeto usa **Vitest** para testes de integração com **isolamento de banco de dados** por arquivo de teste.

### Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│ globalSetup (UMA vez antes de TODOS os testes)             │
│ - Cria banco core: vi-test-db-core-global                  │
│ - Executa initSetup (aplicações, admin, roles, groups)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Teste 1: realm/post.test.ts (paralelo)                     │
│ beforeAll: setTestDatabase('vi-test-db-realm-post')        │
│ afterAll: dropTestDatabase()                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Teste 2: account/post.test.ts (paralelo)                   │
│ beforeAll: setTestDatabase('vi-test-db-realm-account-post')│
│ afterAll: dropTestDatabase()                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ globalTeardown (UMA vez após TODOS os testes)              │
│ - Apaga banco core: vi-test-db-core-global                 │
└─────────────────────────────────────────────────────────────┘
```

## Estrutura de Arquivos

```
test/
├── setup/
│   ├── base.setup.ts          # Inicializa framework (beforeAll/afterAll)
│   ├── globalSetup.ts         # Setup do banco core global
│   └── globalTeardown.ts      # Limpeza do banco core global
├── utils/
│   ├── database.util.ts       # setTestDatabase(), dropTestDatabase()
│   └── test-constants.ts      # TEST_PASSWORD, TEST_EMAIL_DOMAIN
└── integration/
    └── domain/
        └── core/
            └── realm/
                └── post.test.ts   # Exemplo de teste
```

## Como Criar um Teste

### 1. Teste Simples (sem autenticação)

```typescript
// test/integration/domain/core/realm/post.test.ts
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getApp } from '@test/setup/base.setup';
import { dropTestDatabase, setTestDatabase } from '@test/utils/database.util';

describe('POST /api/core/realm', () => {
  beforeAll(() => {
    // Configura banco isolado para este teste
    setTestDatabase('vi-test-db-realm-post');
  });

  afterAll(async () => {
    // Limpa banco após teste
    await dropTestDatabase();
  });

  it('should create a new realm successfully', async () => {
    const realmData = {
      name: `test-realm-${Date.now()}`,
      description: 'Test realm',
      dbName: `test-db-${Date.now()}`,
    };

    const response = await request(getApp().callback())
      .post('/api/core/realm')
      .send(realmData)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(realmData.name);
  });
});
```

### 2. Teste com Autenticação (TODO)

```typescript
// test/integration/domain/realm/account/post.test.ts
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getApp } from '@test/setup/base.setup';
import { dropTestDatabase, setTestDatabase } from '@test/utils/database.util';
import { getAuthToken } from '@test/utils/auth.util'; // TODO: implementar

describe('POST /api/realm/:tenantId/accounts', () => {
  let authToken: string;

  beforeAll(async () => {
    setTestDatabase('vi-test-db-realm-account-post');
    
    // TODO: Implementar getAuthToken
    // authToken = await getAuthToken('admin@test.com', TEST_PASSWORD);
  });

  afterAll(async () => {
    await dropTestDatabase();
  });

  it('should create account with authentication', async () => {
    const response = await request(getApp().callback())
      .post('/api/realm/xxx/accounts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        email: 'newuser@test.com',
        password: 'Test123!'
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
  });
});
```

## Padrão de Nomenclatura

### Bancos de Dados

```
vi-test-db-[tipo]-[modulo]-[operacao]

Exemplos:
- vi-test-db-core-realm-post       # Teste de criação de realm (core)
- vi-test-db-realm-account-post    # Teste de criação de account (realm)
- vi-test-db-realm-group-delete    # Teste de deleção de group (realm)
```

**Regras:**
- `tipo`: `core` ou `realm`
- `modulo`: nome do módulo (realm, account, group, etc)
- `operacao`: operação HTTP (post, get, put, delete, patch)
- Sempre em minúsculas
- Separado por hífen

## Utilitários Disponíveis

### database.util.ts

```typescript
// Configura banco isolado para o teste
setTestDatabase('vi-test-db-realm-account-post');

// Apaga banco após teste
await dropTestDatabase();
```

### test-constants.ts

```typescript
// Senha de teste (atende requisitos OWASP)
TEST_PASSWORD = 'Password123!'

// Domínio de email de teste
TEST_EMAIL_DOMAIN = 'idm-auth.io'
```

## Banco Core Global

### O que é?

- Banco compartilhado entre TODOS os testes
- Nome: `vi-test-db-core-global` (definido em `.env.test`)
- Contém: aplicações, admin, roles, groups

### Por que existe?

- **Performance**: Setup executado UMA vez (não N vezes)
- **Autenticação**: Todos os testes usam este banco para autenticar
- **Isolamento**: Cada teste ainda tem seu próprio banco realm

### Quando é criado?

- `globalSetup.ts` executa ANTES de todos os testes
- Chama `/api/core/system-setup/init-setup`
- Cria realm core, aplicações, admin

### Quando é apagado?

- `globalTeardown.ts` executa APÓS todos os testes
- Apaga `vi-test-db-core-global`

## Problema Resolvido: Ovo e Galinha

### O Problema

1. `initSetup` precisa criar aplicações
2. Aplicações são multi-tenant (precisam de realm)
3. Mas o realm core ainda não existe!

### A Solução

```typescript
// SystemSetupService.initSetup()
async initSetup(data) {
  // 1. Cria realm core se não existir (RealmService não é multi-tenant)
  const coreRealmPublicUUID = await this.realmService.ensureCoreRealmExists();
  
  // 2. Seta tenantId com o publicUUID do realm
  this.executionContext.setTenantId(coreRealmPublicUUID);
  
  // 3. Agora serviços multi-tenant funcionam!
  await this.applicationService.upsertIdmAuthCoreAPIApplication();
}
```

## Configuração do Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    watch: false,
    setupFiles: ['./test/setup/base.setup.ts'],
    globalSetup: [
      './test/setup/globalSetup.ts',
      './test/setup/globalTeardown.ts'
    ],
    exclude: ['**/node_modules/**', '**/old/**', '**/.external/**'],
  },
});
```

## Executar Testes

```bash
# Rodar todos os testes
npm test

# Rodar teste específico
npm test -- test/integration/domain/core/realm/post.test.ts
```

## Fluxo Completo

1. **Início** (`npm test`)
   - `globalSetup.ts` executa
   - Cria `vi-test-db-core-global`
   - Executa `initSetup`

2. **Cada Teste**
   - `beforeAll`: `setTestDatabase('vi-test-db-realm-xxx')`
   - Teste executa (usa banco isolado)
   - `afterAll`: `dropTestDatabase()`

3. **Fim**
   - `globalTeardown.ts` executa
   - Apaga `vi-test-db-core-global`

## Importante

### ✅ Fazer

- Sempre usar `setTestDatabase()` no `beforeAll`
- Sempre usar `dropTestDatabase()` no `afterAll`
- Usar timestamp em dados únicos: `name: \`test-\${Date.now()}\``
- Nomear banco seguindo padrão: `vi-test-db-[tipo]-[modulo]-[operacao]`

### ❌ Não Fazer

- Modificar dados do banco core global
- Compartilhar banco entre testes
- Esquecer de limpar banco no `afterAll`
- Usar dados fixos que podem causar conflito (emails, nomes)

## TODO: Próximos Passos

1. ⏳ Implementar `getAuthToken()` em `test/utils/auth.util.ts`
2. ⏳ Criar testes com autenticação
3. ⏳ Documentar padrão de testes com autorização
4. ⏳ Criar helpers para criar dados de teste (accounts, groups, etc)

## Troubleshooting

### Teste falha com "realm not found"

- Verifique se `setTestDatabase()` está no `beforeAll`
- Verifique se o nome do banco está correto

### Banco não é limpo após teste

- Verifique se `dropTestDatabase()` está no `afterAll`
- Verifique se o `afterAll` está sendo executado (erro no teste pode pular)

### Testes interferem uns nos outros

- Cada teste deve ter seu próprio banco
- Use timestamp em dados únicos
- Não modifique banco core global
