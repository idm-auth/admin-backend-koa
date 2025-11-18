# MongoDB Collections Naming Guide

## Convenção de Nomenclatura

### Regra Principal
Para domínios com múltiplas palavras, **SEMPRE use hífen (-) para separar palavras** no nome da collection.

### Exemplos Práticos

#### Domínios Multi-palavra
```typescript
// Domain: account-groups
const schemaName = 'account-groups';

// Domain: account-roles  
const schemaName = 'account-roles';

// Domain: user-permissions
const schemaName = 'user-permissions';

// Domain: group-policies
const schemaName = 'group-policies';
```

#### Domínios Palavra Única
```typescript
// Domain: accounts
const schemaName = 'accounts';

// Domain: groups
const schemaName = 'groups';

// Domain: roles
const schemaName = 'roles';

// Domain: policies
const schemaName = 'policies';
```

## Por que Hífen?

### Problemas com camelCase
```typescript
// ❌ PROBLEMA: MongoDB é case insensitive
const schemaName = 'accountGroups';  // Pode conflitar com
const schemaName = 'AccountGroups';  // Este nome
const schemaName = 'accountgroups';  // Ou este
```

### Vantagens do Hífen
- **Consistência**: Mesmo padrão das URLs (`/account-groups`)
- **Clareza**: Separação visual clara entre palavras
- **Compatibilidade**: Funciona em todos os sistemas de banco
- **Padrão**: Amplamente adotado em bancos NoSQL

## Estrutura Correspondente

### Mapeamento Domínio → Collection
```
src/domains/realms/
├── account-groups/     → 'account-groups'
├── account-roles/      → 'account-roles'
├── accounts/           → 'accounts'
├── groups/             → 'groups'
├── roles/              → 'roles'
└── policies/           → 'policies'
```

### Resultado no MongoDB
```javascript
// Collections criadas no banco:
db.account-groups.find()  // ✅ Claro e consistente
db.account-roles.find()   // ✅ Claro e consistente
db.accounts.find()        // ✅ Claro e consistente
```

## Implementação no Código

### Template para Model
```typescript
import mongoose from 'mongoose';
import { getRealmDb } from '@/plugins/mongo.plugin';

// Para domínios multi-palavra: use hífen
const schemaName = 'account-groups';

export const schema = new mongoose.Schema({
  // schema definition
});

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<DocumentType>(schemaName, schema);
};
```

## Verificação Rápida

### Checklist para Novos Domínios
- [ ] Nome da collection corresponde ao diretório?
- [ ] Múltiplas palavras usam hífen?
- [ ] Não usa camelCase, PascalCase ou underscore?
- [ ] Segue padrão kebab-case?

### Comando de Verificação
```bash
# Verificar collections no MongoDB
db.runCommand("listCollections").cursor.firstBatch.forEach(
  function(collection) { 
    print(collection.name); 
  }
);
```

## Migração de Collections Existentes

Se encontrar collections com nomenclatura incorreta:

1. **Identifique** a collection com nome incorreto
2. **Crie** nova collection com nome correto
3. **Migre** os dados usando MongoDB tools
4. **Atualize** o código para usar novo nome
5. **Remova** collection antiga após validação

### Exemplo de Migração
```javascript
// Renomear collection (se necessário)
db.accountGroups.renameCollection('account-groups');
```

## Benefícios

### Para Desenvolvimento
- **Consistência** entre código, URLs e banco
- **Legibilidade** melhorada em queries
- **Manutenção** mais fácil

### Para Operações
- **Backup/Restore** mais previsível
- **Monitoring** com nomes claros
- **Debugging** mais eficiente

---

**Regra de Ouro**: Se o domínio tem hífen, a collection também deve ter hífen.