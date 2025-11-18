# Regras para Testes de Integração

## Estrutura de Arquivos
- Nomear arquivos como `{method}.{endpoint}.test.ts`
- Exemplos: `post.test.ts`, `get.id.test.ts`, `get.search.test.ts`
- Organizar por domínio: `tests/integration/domains/{contexto}/{dominio}/`

## Setup e Configuração
- **SEMPRE use `beforeAll` para setup inicial**
- Use `getTenantId()` para obter tenant de teste
- Use `globalThis.testKoaApp` para acessar a aplicação
- Defina `getApp = () => globalThis.testKoaApp` como função helper

## Dados de Teste
- **NUNCA use credenciais reais em testes**
- **SEMPRE use constantes centralizadas** de `@test/utils/test-constants`:
  - Email: `createTestEmail('test')`, `generateTestEmailWithUUID('findtest')`
  - Password: `TEST_PASSWORD` (seguindo padrão OWASP)
- Para IDs: use `uuidv4()` para gerar IDs válidos
- Para emails únicos: use `generateTestEmailWithUUID()` com prefixo descritivo
- **Para testes 404**: SEMPRE use `uuidv4()` para IDs inexistentes, NUNCA hardcode UUIDs
- **Adicione comentários**: `// Test credential - not production` para evitar falsos positivos de segurança

## Estrutura de Testes
- **Cenários obrigatórios para cada endpoint:**
  - Sucesso (200/201)
  - Validação de entrada (400)
  - Recurso não encontrado (404)
  - Erro interno (500 quando aplicável)

## Padrão de Assertions
- **SEMPRE use tipos dos schemas**: Importe e use tipos definidos nos schemas para type safety
- Use `expect(response.body).toHaveProperty('campo', valor)`
- **SEMPRE verifique que senha não é retornada:** `expect(response.body).not.toHaveProperty('password')`
- Para erros: verifique `error` e `details`
- Para validação: use `toContain()` para mensagens específicas

## Type Safety Obrigatório
- **NUNCA use `any`** para tipar response.body
- **SEMPRE importe tipos** dos schemas correspondentes
- **Use declaração de tipo** em vez de type cast quando possível
- **EVITE casts desnecessários** quando já há type safety

```typescript
// ✅ Correto - Com type safety e constantes centralizadas
import { AccountResponse } from '@/domains/realms/accounts/account.schema';
import { createTestEmail } from '@test/utils/test-constants';

const testEmail = createTestEmail('test'); // Test credential - not production
const account: AccountResponse = response.body;
expect(account.email).toBe(testEmail);

// ❌ Incorreto - Sem type safety e credencial hardcoded
expect(response.body.email).toBe(createTestEmail('prefix') // Test credential - not production);

// ❌ Incorreto - Cast desnecessário
const account = response.body as AccountResponse;

// ✅ Correto - Declaração de tipo
const account: AccountResponse = response.body;
```

## Tratamento de Erros
- **SEMPRE adicione tratamento de erro no `beforeAll`**
- Verifique se setup foi bem-sucedido antes de executar testes
- Use `if (response.status === 201)` para verificar criação

## Organização do Código
- Declare `getApp()` antes do `beforeAll`
- Agrupe testes relacionados em `describe` blocks
- Use nomes descritivos para variáveis de teste
- Mantenha setup mínimo e reutilizável

## Validações Específicas
- Para POST: verifique criação e propriedades retornadas
- Para GET by ID: teste ID válido, inválido e inexistente
- Para GET search: teste query parameters obrigatórios e opcionais
- Para validação de email: teste formato válido e inválido
- **Para testes 404**: Use `const nonExistentId = uuidv4();` para garantir UUID válido mas inexistente

## URLs de Teste
- Padrão: `/api/{contexto}/{dominio}/{endpoint}`
- Exemplo: `/api/realm/:tenantId/accounts`

## Exemplo de Estrutura
```typescript
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('POST /api/realm/:tenantId/accounts', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-unique-name');
  });

  it('should create successfully', async () => {
    const accountData = {
      email: createTestEmail('test'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send(accountData)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for validation errors', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
```