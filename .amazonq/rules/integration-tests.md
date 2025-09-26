# Regras para Testes de Integração

## Estrutura de Arquivos
- Nomear arquivos como `{method}.{endpoint}.test.ts`
- Exemplos: `post.test.ts`, `get.id.test.ts`, `get.search.test.ts`
- Organizar por rota: `tests/integration/routes/{domain}/{version}/{resource}/`

## Setup e Configuração
- **SEMPRE use `beforeAll` para setup inicial**
- Use `getTenantId()` para obter tenant de teste
- Use `globalThis.testKoaApp` para acessar a aplicação
- Defina `getApp = () => globalThis.testKoaApp` como função helper

## Dados de Teste
- **NUNCA use credenciais reais em testes**
- Use dados fictícios consistentes:
  - Email: `test@example.com`, `findtest@example.com`
  - Password: `Password123!` (seguindo padrão OWASP)
- Para IDs: use `uuidv4()` para gerar IDs válidos
- Para emails únicos: use prefixo descritivo (`searchtest@`, `findtest@`)

## Estrutura de Testes
- **Cenários obrigatórios para cada endpoint:**
  - Sucesso (200/201)
  - Validação de entrada (400)
  - Recurso não encontrado (404)
  - Erro interno (500 quando aplicável)

## Padrão de Assertions
- Use `expect(response.body).toHaveProperty('campo', valor)`
- **SEMPRE verifique que senha não é retornada:** `expect(response.body).not.toHaveProperty('password')`
- Para erros: verifique `error` e `details`
- Para validação: use `toContain()` para mensagens específicas

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

## Exemplo de Estrutura
```typescript
describe('POST /api/core/v1/realm/:tenantId/users', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-unique-name');
  });

  it('should create successfully', async () => {
    // teste de sucesso
  });

  it('should return 400 for validation errors', async () => {
    // testes de validação
  });
});
```