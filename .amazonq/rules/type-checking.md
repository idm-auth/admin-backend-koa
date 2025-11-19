# Regras de Validação de Tipos TypeScript

## Princípio Fundamental

**ZERO ERROS DE TIPO SÃO PERMITIDOS**

Todos os erros de TypeScript devem ser corrigidos antes de considerar o código pronto.

## Comando Obrigatório

### Script no package.json
```json
{
  "scripts": {
    "type-check": "npx tsc --noEmit --strict"
  }
}
```

### Execução Obrigatória
```bash
# Validação de tipos rigorosa
npm run type-check

# DEVE retornar sem erros para ser aceito
# ✅ Sucesso: nenhuma saída
# ❌ Falha: qualquer erro mostrado
```

## Integração com Outras Validações

### Sequência Obrigatória de Validação
```bash
# 1. Correção de lint
npm run lint:fix

# 2. Validação de tipos (ZERO ERROS)
npm run type-check

# 3. Execução de testes
npm test 2>&1 | tail -50
```

### Todas as validações DEVEM passar sem erros

## O que `--strict` Valida

### Verificações Rigorosas Ativas:
- **`--noImplicitAny`**: Proíbe tipos `any` implícitos
- **`--strictNullChecks`**: `null` e `undefined` são tipos separados
- **`--noImplicitReturns`**: Funções devem ter return explícito
- **`--strictFunctionTypes`**: Verificação rigorosa de tipos de função
- **`--strictPropertyInitialization`**: Propriedades devem ser inicializadas
- **`--noImplicitThis`**: Proíbe `this` implícito
- **`--useUnknownInCatchVariables`**: `catch (e)` será `unknown`

## Erros Comuns e Soluções

### Tipo `any` Implícito
```typescript
// ❌ Erro: Parameter 'param' implicitly has an 'any' type
function test(param) {
  return param;
}

// ✅ Correto: Tipo explícito
function test(param: string) {
  return param;
}
```

### Null/Undefined não Tratados
```typescript
// ❌ Erro: Object is possibly 'null'
let value: string | null = getValue();
value.toString();

// ✅ Correto: Verificação de null
if (value !== null) {
  value.toString();
}
```

### Return Implícito
```typescript
// ❌ Erro: Not all code paths return a value
function getValue(condition: boolean): string {
  if (condition) {
    return 'value';
  }
  // Missing return
}

// ✅ Correto: Return explícito
function getValue(condition: boolean): string {
  if (condition) {
    return 'value';
  }
  return 'default';
}
```

## Regras de Implementação

### SEMPRE Corrigir Erros de Tipo
- **NUNCA ignore** erros de TypeScript
- **NUNCA use `@ts-ignore`** sem justificativa extrema
- **SEMPRE tipifique** parâmetros e retornos
- **SEMPRE trate** casos null/undefined

### Processo Obrigatório
1. **Execute `npm run type-check`**
2. **Corrija TODOS os erros** mostrados
3. **Execute novamente** até zero erros
4. **Só então** considere o código pronto

## Tolerância Zero

### Não é Aceitável:
- ❌ "Só tem 1 erro de tipo"
- ❌ "É só um warning"
- ❌ "Funciona mesmo com erro"
- ❌ "Vou corrigir depois"

### É Obrigatório:
- ✅ **Zero erros** na saída do `npm run type-check`
- ✅ **Tipos explícitos** em todas as funções
- ✅ **Tratamento de null/undefined** onde necessário
- ✅ **Validação antes** de qualquer commit

## Benefícios da Validação Rigorosa

### Qualidade do Código
- **Detecção precoce** de bugs
- **Código mais robusto** e confiável
- **Melhor IntelliSense** no IDE
- **Refatoração segura**

### Produtividade
- **Menos bugs** em runtime
- **Debugging mais fácil**
- **Documentação automática** via tipos
- **Colaboração melhor** entre desenvolvedores

## Regra de Ouro

**Se `npm run type-check` mostra qualquer erro, o código NÃO está pronto.**

**Zero erros de tipo = Código aprovado para uso.**

Esta regra é **inviolável** e deve ser seguida em 100% dos casos.