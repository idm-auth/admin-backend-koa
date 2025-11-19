# Arquitetura de Testes - IA Rules

## TRIGGERS AUTOMÁTICOS - ESTRUTURA

### SE criando teste unitário
→ **ENTÃO** use `tests/unit/domains/{contexto}/{dominio}/{camada}/{funcao}.test.ts`

### SE criando teste de integração
→ **ENTÃO** use `tests/integration/domains/{contexto}/{dominio}/{method}.{endpoint}.test.ts`

### SE testando múltiplas funções
→ **ENTÃO** crie arquivo separado para cada função

### SE testando múltiplos cenários da mesma função
→ **ENTÃO** mantenha no mesmo arquivo

### SE removendo teste por duplicação
→ **ENTÃO** analise conteúdo primeiro, nunca assuma pelo nome

## TRIGGERS AUTOMÁTICOS - NOMENCLATURA

### SE nomeando teste unitário
→ **ENTÃO** use `{nomeDaFuncao}.test.ts`

### SE nomeando teste de integração
→ **ENTÃO** use `{method}.{endpoint}.test.ts`

### SE criando dados de teste
→ **ENTÃO** use `createTestEmail('prefix')`, `TEST_PASSWORD`, `uuidv4()`

### SE testando 404
→ **ENTÃO** use `const nonExistentId = uuidv4()`

### SE adicionando comentário em credenciais
→ **ENTÃO** use `// Test credential - not production`

## TRIGGERS AUTOMÁTICOS - SETUP

### SE configurando teste unitário
→ **ENTÃO** use `getTenantId('unique-name')` + imports diretos

### SE configurando teste de integração
→ **ENTÃO** use `beforeAll` + `getTenantId()` + `globalThis.testKoaApp`

### SE fazendo validação
→ **ENTÃO** use `expect(result).toHaveProperty('_id')`, nunca `.toBeTruthy()`

### SE definindo type safety
→ **ENTÃO** use `const account: AccountResponse = response.body`

### SE importando tipos
→ **ENTÃO** importe dos schemas, evite casts `as Type`

### SE criando teste
→ **ENTÃO** tente integração primeiro, unitário apenas para lacunas

### SE analisando duplicação de testes
→ **ENTÃO** leia conteúdo completo, compare cenários, identifique valor único

### SE teste unitário existe com integração
→ **ENTÃO** verifique se testa cenário específico não coberto pela integração

### SE removendo por duplicação
→ **ENTÃO** confirme mesmo cenário + mesma cobertura + zero valor adicional

### SE localizando teste de validação
→ **ENTÃO** coloque no arquivo da função testada

### SE localizando teste de erro
→ **ENTÃO** coloque no arquivo da função que gera o erro

### SE executando coverage
→ **ENTÃO** busque 100% em todas as métricas, NUNCA aceite menos

### SE coverage não é 100%
→ **ENTÃO** identifique linhas não cobertas e crie testes específicos

### SE encontrando linha não coberta
→ **ENTÃO** analise código fonte e crie cenário para executá-la

## AÇÕES OBRIGATÓRIAS

### Estrutura de arquivos
- **1 arquivo = 1 função** (regra inviolável)
- **Unitários**: `/{camada}/{funcao}.test.ts`
- **Integração**: `/{method}.{endpoint}.test.ts`

### Setup unitários
- `getTenantId('unique-name')` para contexto isolado
- MongoDB em memória disponível
- Imports diretos: `import * as service from '@/domains/...`

### Setup integração
- `beforeAll` + `getTenantId()`
- `const getApp = () => globalThis.testKoaApp`
- Constantes: `@test/utils/test-constants`

### Cenários obrigatórios
- **Unitários**: Sucesso + erros + edge cases
- **Integração**: 200/201, 400, 404, 500

### URLs obrigatórias
- **Padrão**: `/api/{contexto}/{dominio}/{endpoint}`

### Prioridades (PRIORIDADE ABSOLUTA)
1. **Integração primeiro** - SEMPRE quando possível
2. **Unitários** - APENAS para lacunas não cobertas

### Processo obrigatório para novos testes
1. **SEMPRE tente integração primeiro**
2. **Se não for possível**, justifique por que
3. **Então crie teste unitário**

### Unitários APENAS para
- **Funções utilitárias específicas** (comparePassword, hashPassword)
- **Cenários de erro específicos** não exercitados pela integração
- **Edge cases isolados** difíceis de reproduzir na integração
- **Lógica pura** sem dependências externas

### Cobertura obrigatória (PERFEIÇÃO)
- **100% Statements** - todas as declarações executadas
- **100% Branches** - todos os caminhos condicionais testados
- **100% Functions** - todas as funções chamadas
- **100% Lines** - todas as linhas cobertas
- **Comandos**: `npm run test:coverage`, `npm run test:coverage:ui`

## GUARDRAILS OBRIGATÓRIOS

### Duplicação
- **NUNCA assuma** duplicação pelo nome do arquivo
- **SEMPRE analise** conteúdo antes de remover
- **SEMPRE compare** cenários e objetivos de cada teste
- **SEMPRE identifique** valor único de cada um

### Sinais de duplicação real
- ❌ Mesmo cenário testado
- ❌ Mesma cobertura de funcionalidade  
- ❌ Nenhum valor adicional específico
- ❌ Teste unitário apenas repete integração

### Sinais de valor único
- ✅ Cenários diferentes
- ✅ Cobertura de edge cases específicos
- ✅ Teste de funções utilitárias
- ✅ Validação de erros específicos

### Regra Inviolável
**Função diferente = Arquivo diferente**

### Cobertura - Tolerância Zero
- **99.9% não é aceitável** - deve ser 100%
- **"Quase perfeito" não é perfeito** - busque a perfeição
- **Imprecisões do tool não são desculpa** - investigue e corrija
- **Se não é 100%, não está pronto** - perfeição é o único padrão

## PADRÕES DE RECONHECIMENTO

### Múltiplas funções quando vejo:
- Testes de `create` e `update` no mesmo arquivo
- Testes de `findById` e `findAll` juntos
- Mistura de controller e service no mesmo arquivo

### Mesma função quando vejo:
- Múltiplos cenários de `create` (sucesso, erro, validação)
- Diferentes inputs para `findById`
- Vários casos de erro da mesma função

### Dados de teste disponíveis:
- **Email**: `createTestEmail('prefix')` ou `generateTestEmailWithUUID('prefix')`
- **Password**: `TEST_PASSWORD`
- **IDs**: `uuidv4()`
- **404 tests**: `const nonExistentId = uuidv4()`