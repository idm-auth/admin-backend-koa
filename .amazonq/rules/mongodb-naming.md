# MongoDB Collection Naming Rules

## Nomenclatura de Collections

### Regra Obrigatória para Múltiplas Palavras
- **SEMPRE use hífen (-) para separar palavras** em nomes de collections
- **NUNCA use camelCase** - MongoDB ignora case sensitivity em nomes de collections
- **NUNCA use underscore (_)** - prefira hífen para consistência

### Exemplos Corretos
```typescript
// ✅ Correto - múltiplas palavras com hífen
const schemaName = 'account-groups';
const schemaName = 'account-roles';
const schemaName = 'user-permissions';
const schemaName = 'group-policies';

// ✅ Correto - palavra única
const schemaName = 'accounts';
const schemaName = 'groups';
const schemaName = 'roles';
```

### Exemplos Incorretos
```typescript
// ❌ Incorreto - camelCase (MongoDB ignora)
const schemaName = 'accountGroups';
const schemaName = 'accountRoles';

// ❌ Incorreto - underscore
const schemaName = 'account_groups';
const schemaName = 'account_roles';

// ❌ Incorreto - PascalCase
const schemaName = 'AccountGroups';
```

## Justificativa

### Por que hífen em vez de camelCase:
- **MongoDB case insensitive**: `accountGroups` e `AccountGroups` são tratados como iguais
- **Consistência**: Evita confusão entre diferentes cases
- **Legibilidade**: Hífen torna mais claro a separação de palavras
- **Convenção**: Padrão amplamente adotado em bancos NoSQL

### Por que hífen em vez de underscore:
- **Consistência com URLs**: APIs usam hífen (`/account-groups`)
- **Padrão do projeto**: Mantém consistência com estrutura de domínios
- **Legibilidade**: Hífen é mais visualmente claro

## Padrão de Implementação

### No arquivo model.ts:
```typescript
// Para domínios com múltiplas palavras
const schemaName = 'account-groups';  // account-groups domain
const schemaName = 'account-roles';   // account-roles domain
const schemaName = 'user-sessions';   // user-sessions domain

// Para domínios com palavra única
const schemaName = 'accounts';        // accounts domain
const schemaName = 'groups';          // groups domain
const schemaName = 'roles';           // roles domain
```

### Correspondência com estrutura de domínios:
```
src/domains/realms/
├── account-groups/     → collection: 'account-groups'
├── account-roles/      → collection: 'account-roles'  
├── accounts/           → collection: 'accounts'
├── groups/             → collection: 'groups'
└── roles/              → collection: 'roles'
```

## Verificação

### Checklist para novos domínios:
- [ ] Nome da collection usa hífen para múltiplas palavras?
- [ ] Nome corresponde ao diretório do domínio?
- [ ] Não usa camelCase ou underscore?
- [ ] Segue padrão kebab-case?

## Regra de Ouro

**Se o domínio tem múltiplas palavras, a collection DEVE usar hífen para separá-las.**

Esta regra garante consistência e evita problemas de case sensitivity no MongoDB.