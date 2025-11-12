# Arquitetura de Testes - Regras Fundamentais

## Princípio Inviolável

**1 arquivo por função/funcionalidade**

Cada arquivo de teste deve testar uma única função ou funcionalidade específica.

## Estrutura Organizacional

### Organização DDD Obrigatória
```
tests/unit/domains/{contexto}/{dominio}/
├── controller/     # Funções do controller
├── service/        # Funções do service  
├── mapper/         # Funções do mapper
└── model/          # Funcionalidades do model
```

### Nomenclatura Obrigatória
- **Funções**: `{nomeDaFuncao}.test.ts`
- **Funcionalidades**: `{nomeDaFuncionalidade}.test.ts`

## Regras de Consolidação

### ✅ PERMITIDO - Consolidar cenários da mesma função/funcionalidade
```typescript
// Correto - Mesma função, cenários diferentes
describe('account.service.create', () => {
  it('should create successfully')
  it('should throw ValidationError for duplicate')
  it('should handle database error')
});
```

### ❌ PROIBIDO - Consolidar funções/funcionalidades diferentes
```typescript
// Incorreto - Funções diferentes em um arquivo
describe('account.service', () => {
  describe('create', () => { ... })    // Deve ser arquivo separado
  describe('update', () => { ... })    // Deve ser arquivo separado
});
```

## Localização de Testes Específicos

### Testes de Validação
**SEMPRE** no arquivo da função/funcionalidade que está sendo testada:

```typescript
// ✅ Em toCreateResponse.test.ts
describe('account.mapper.toCreateResponse', () => {
  it('should return primary email')
  it('should throw error for invalid email data')  // Validação específica
});
```

### Testes de Erro
**SEMPRE** no arquivo da função/funcionalidade que pode gerar o erro:

```typescript
// ✅ Em resetPassword.test.ts
describe('account.service.resetPassword', () => {
  it('should reset successfully')
  it('should handle save error')  // Erro específico desta função
});
```

## Exemplos por Camada

### Controller
- `create.test.ts` → testa `controller.create()`
- `findById.test.ts` → testa `controller.findById()`
- `remove.test.ts` → testa `controller.remove()`

### Service  
- `create.test.ts` → testa `service.create()`
- `addEmail.test.ts` → testa `service.addEmail()`
- `comparePassword.test.ts` → testa `service.comparePassword()`

### Mapper
- `toCreateResponse.test.ts` → testa `mapper.toCreateResponse()`
- `toUpdateResponse.test.ts` → testa `mapper.toUpdateResponse()`
- `toListItemResponse.test.ts` → testa `mapper.toListItemResponse()`

### Model
- `schema.test.ts` → testa estrutura do schema
- `pre-save.test.ts` → testa funcionalidade do hook pre-save

## Benefícios

### Organização
- **Localização imediata**: 1 função = 1 arquivo
- **Responsabilidade única**: Propósito claro de cada arquivo
- **Navegação intuitiva**: Estrutura espelha o código

### Manutenibilidade  
- **Mudanças isoladas**: Alteração afeta apenas 1 arquivo
- **Debug simplificado**: Falhas apontam diretamente para a função
- **Refatoração segura**: Estrutura clara facilita mudanças

### Escalabilidade
- **Padrão consistente**: Mesmo padrão em todos os domínios
- **Expansão fácil**: Novas funções seguem o padrão
- **Evolução controlada**: Mudanças não quebram estrutura

## Validação da Arquitetura

### Checklist de Verificação
- [ ] Cada arquivo testa apenas 1 função/funcionalidade?
- [ ] Organização segue estrutura DDD?
- [ ] Nomenclatura segue padrão `{nome}.test.ts`?
- [ ] Testes de validação estão no arquivo correto?
- [ ] Não há consolidação de funções diferentes?

### Sinais de Problema
- ❌ Arquivo com múltiplas funções testadas
- ❌ Testes de validação em arquivo genérico
- ❌ Nomenclatura inconsistente
- ❌ Estrutura não segue DDD
- ❌ Consolidação inadequada

## Regra de Ouro

**Se você está testando uma função/funcionalidade diferente, crie um arquivo diferente.**

Esta regra é **inviolável** e deve ser seguida em 100% dos casos.