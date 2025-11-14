# Arquitetura de Testes Unitários

## Princípio Fundamental

**1 arquivo por função/funcionalidade**

Cada arquivo de teste deve testar uma única função ou funcionalidade específica, seguindo a organização DDD (Domain-Driven Design).

## Estrutura Organizacional

### Organização por Responsabilidade (DDD)
```
tests/unit/domains/{contexto}/{dominio}/
├── controller/     # Testa funções do controller
├── service/        # Testa funções do service  
├── mapper/         # Testa funções do mapper
└── model/          # Testa funcionalidades do model
```

### Padrão de Nomenclatura
- **Funções específicas**: `{nomeDaFuncao}.test.ts`
- **Funcionalidades específicas**: `{nomeDaFuncionalidade}.test.ts`

## Exemplos por Camada

### Controller
```
controller/
├── create.test.ts           # Testa controller.create()
├── findById.test.ts         # Testa controller.findById()
├── findAllPaginated.test.ts # Testa controller.findAllPaginated()
└── remove.test.ts           # Testa controller.remove()
```

### Service
```
service/
├── create.test.ts           # Testa service.create()
├── findById.test.ts         # Testa service.findById()
├── addEmail.test.ts         # Testa service.addEmail()
├── updatePassword.test.ts   # Testa service.updatePassword()
└── comparePassword.test.ts  # Testa service.comparePassword()
```

### Mapper
```
mapper/
├── toCreateResponse.test.ts     # Testa mapper.toCreateResponse()
├── toUpdateResponse.test.ts     # Testa mapper.toUpdateResponse()
└── toListItemResponse.test.ts   # Testa mapper.toListItemResponse()
```

### Model
```
model/
├── schema.test.ts           # Testa estrutura do schema
└── pre-save.test.ts         # Testa funcionalidade do hook pre-save
```

## Consolidação de Cenários

### Quando Consolidar
Consolide apenas **cenários diferentes da mesma função/funcionalidade**:

```typescript
// ✅ Correto - Mesma função, cenários diferentes
describe('account.service.create', () => {
  it('should create account successfully')           // Cenário sucesso
  it('should throw ValidationError for duplicate')   // Cenário erro
  it('should handle database connection error')      // Cenário erro técnico
});
```

### Quando NÃO Consolidar
**NUNCA** consolide funções/funcionalidades diferentes:

```typescript
// ❌ Incorreto - Funções diferentes
describe('account.service', () => {
  describe('create', () => { ... })     // Função create
  describe('update', () => { ... })     // Função update - DEVE ser arquivo separado
});
```

## Testes de Validação

### Regra de Localização
Testes de validação devem estar **no arquivo da função/funcionalidade específica** que está sendo testada:

```typescript
// ✅ Correto - Em toCreateResponse.test.ts
describe('account.mapper.toCreateResponse', () => {
  it('should return primary email when exists')
  it('should throw error when email data is invalid')  // Validação específica
});
```

## Benefícios da Arquitetura

### Organização
- **Localização fácil**: 1 função = 1 arquivo
- **Responsabilidade única**: Cada arquivo tem propósito claro
- **Navegação intuitiva**: Estrutura espelha o código fonte

### Manutenibilidade
- **Mudanças isoladas**: Alteração em função afeta apenas 1 arquivo
- **Testes focados**: Cenários específicos para cada função
- **Debug simplificado**: Falhas apontam diretamente para a função

### Escalabilidade
- **Padrão consistente**: Mesmo padrão em todos os domínios
- **Fácil expansão**: Novas funções seguem o mesmo padrão
- **Refatoração segura**: Estrutura clara facilita mudanças

## Exemplo Completo

### Estrutura Real - accounts
```
tests/unit/domains/realms/accounts/
├── controller/
│   ├── findAllPaginated.test.ts  # 1 função
│   └── remove.test.ts            # 1 função
├── mapper/
│   ├── toCreateResponse.test.ts  # 1 função + validações
│   ├── toListItemResponse.test.ts # 1 função + validações  
│   └── toUpdateResponse.test.ts  # 1 função + validações
├── model/
│   ├── pre-save.test.ts          # 1 funcionalidade (hook)
│   └── schema.test.ts            # 1 funcionalidade (estrutura)
└── service/
    ├── create.test.ts            # 1 função
    ├── findById.test.ts          # 1 função
    ├── addEmail.test.ts          # 1 função
    ├── updatePassword.test.ts    # 1 função
    └── ... (12 arquivos total)   # 1 função cada
```

## Regras de Ouro

1. **1 arquivo por função/funcionalidade** - Inviolável
2. **Organização DDD** - Separação por responsabilidade
3. **Nomenclatura consistente** - `{nome}.test.ts`
4. **Validações no arquivo correto** - Da função específica
5. **Consolidação apenas de cenários** - Nunca de funções diferentes