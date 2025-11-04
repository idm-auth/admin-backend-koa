# Sistema de Permissões por Recurso (RBAC Granular)

## Visão Geral

O sistema de permissões por recurso permite controle granular sobre **O QUE** cada usuário pode fazer **ONDE**, expandindo o RBAC básico atual para um modelo mais flexível e poderoso.

## Estado Atual vs Futuro

### Estado Atual (RBAC Básico)
```
Account → Roles → Policies
Account → Groups → Roles → Policies
```

**Limitações:**
- Permissões são "tudo ou nada"
- Não há controle granular por recurso específico
- Difícil implementar regras como "só pode editar própria conta"

### Estado Futuro (RBAC Granular)
```
Account → Roles → Policies → [Resource + Actions]
```

**Vantagens:**
- Controle granular por recurso
- Permissões específicas por ação
- Flexibilidade para casos complexos

## Conceitos Fundamentais

### Recursos (Resources)
Representam as "coisas" que queremos proteger:

```typescript
// Recursos globais
"accounts"           // Todos os accounts
"groups"             // Todos os groups  
"policies"           // Todas as policies
"roles"              // Todas as roles

// Recursos específicos
"accounts:123"       // Account específico
"groups:admin"       // Group específico
"policies:hr-policy" // Policy específica

// Recursos hierárquicos
"realm:settings"     // Configurações do realm
"realm:billing"      // Billing do realm
"tenant:*"           // Todos os recursos do tenant
```

### Ações (Actions)
Representam as operações que podem ser realizadas:

```typescript
// Ações CRUD básicas
"create", "read", "update", "delete"

// Ações específicas
"list", "search", "export"
"manage", "admin", "owner"

// Ações compostas
"read:sensitive"     // Ler dados sensíveis
"update:password"    // Alterar senha
"delete:permanent"   // Exclusão definitiva
```

## Estrutura de Dados

### Policy Expandida
```typescript
interface Policy {
  _id: string;
  name: string;
  description?: string;
  
  // Nova estrutura de permissões
  permissions: Permission[];
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
}

interface Permission {
  resource: string;           // "accounts", "accounts:123", "groups:*"
  actions: string[];          // ["create", "read", "update"]
  conditions?: Condition[];   // Condições opcionais (futuro)
}

interface Condition {
  field: string;              // "owner", "group", "department"
  operator: string;           // "equals", "in", "not_in"
  value: any;                 // "self", ["hr", "admin"]
}
```

### Exemplos de Policies

#### HR Manager
```json
{
  "name": "HR Manager",
  "permissions": [
    {
      "resource": "accounts",
      "actions": ["create", "read", "update"]
    },
    {
      "resource": "groups:hr",
      "actions": ["read", "update", "manage"]
    },
    {
      "resource": "groups:finance", 
      "actions": ["read"]
    },
    {
      "resource": "realm:settings",
      "actions": ["read"]
    }
  ]
}
```

#### Account Owner
```json
{
  "name": "Account Owner",
  "permissions": [
    {
      "resource": "accounts:self",
      "actions": ["read", "update"]
    },
    {
      "resource": "accounts:self:password",
      "actions": ["update"]
    }
  ]
}
```

#### Realm Administrator
```json
{
  "name": "Realm Admin",
  "permissions": [
    {
      "resource": "*",
      "actions": ["*"]
    }
  ]
}
```

## Sistema de Matching

### Wildcards
```typescript
"accounts:*"         // Todos os accounts
"groups:hr:*"        // Todos os recursos do grupo HR
"*"                  // Todos os recursos
```

### Hierarquia
```typescript
"accounts"           // Nível superior
"accounts:123"       // Recurso específico
"accounts:123:profile" // Sub-recurso
```

### Palavras-chave Especiais
```typescript
"accounts:self"      // Própria account do usuário
"groups:own"         // Grupos que o usuário pertence
"tenant:current"     // Tenant atual
```

## Implementação

### Middleware de Autorização
```typescript
// Verificar permissão antes de executar operação
const checkPermission = async (
  userId: string, 
  action: string, 
  resource: string
): Promise<boolean> => {
  // 1. Buscar roles do usuário
  const userRoles = await getUserRoles(userId);
  
  // 2. Buscar policies das roles
  const policies = await getPoliciesFromRoles(userRoles);
  
  // 3. Verificar se alguma policy permite a ação no recurso
  return policies.some(policy => 
    hasPermission(policy, action, resource)
  );
};

// Uso nos controllers
export const update = async (ctx: Context) => {
  const { id } = ctx.validated.params;
  const userId = ctx.user.id;
  
  // Verificar permissão
  const canUpdate = await checkPermission(userId, "update", `accounts:${id}`);
  if (!canUpdate) {
    throw new ForbiddenError("Insufficient permissions");
  }
  
  // Continuar com a operação...
};
```

### Decorator para Rotas
```typescript
// Decorator para simplificar uso
@RequirePermission("update", "accounts:param:id")
export const updateAccount = async (ctx: Context) => {
  // Lógica do controller
};

@RequirePermission("create", "groups")
export const createGroup = async (ctx: Context) => {
  // Lógica do controller
};
```

## Casos de Uso Práticos

### 1. Gerente de Departamento
- Pode gerenciar accounts do seu departamento
- Pode visualizar outros departamentos
- Não pode alterar configurações globais

### 2. Usuário Final
- Pode editar apenas seu próprio perfil
- Pode visualizar grupos que pertence
- Não pode criar/deletar outros usuários

### 3. Administrador de Sistema
- Acesso total ao realm
- Pode gerenciar todas as entidades
- Pode alterar configurações críticas

### 4. Auditor
- Acesso de leitura a tudo
- Não pode modificar nada
- Pode exportar relatórios

## Benefícios

### Segurança
- **Princípio do menor privilégio**: Usuários têm apenas as permissões necessárias
- **Controle granular**: Permissões específicas por recurso
- **Auditoria**: Fácil rastrear quem pode fazer o quê

### Flexibilidade
- **Casos complexos**: Suporte a cenários de negócio específicos
- **Escalabilidade**: Adicionar novos recursos e ações facilmente
- **Customização**: Policies específicas por tenant

### Manutenibilidade
- **Separação clara**: Recursos, ações e policies bem definidos
- **Reutilização**: Policies podem ser reutilizadas entre roles
- **Evolução**: Sistema pode crescer sem quebrar compatibilidade

## Roadmap de Implementação

### Fase 1: Base
1. Expandir modelo de Policy para incluir permissions
2. Implementar sistema básico de matching
3. Criar middleware de autorização
4. Testes unitários e de integração

### Fase 2: Recursos Básicos
1. Implementar recursos para accounts, groups, roles, policies
2. Adicionar wildcards básicos
3. Implementar palavras-chave especiais (self, own)
4. Documentação e exemplos

### Fase 3: Recursos Avançados
1. Sistema de condições
2. Hierarquia de recursos
3. Cache de permissões
4. Auditoria de acesso

### Fase 4: Otimizações
1. Performance tuning
2. Cache distribuído
3. Métricas e monitoramento
4. Ferramentas de debug

## Considerações Técnicas

### Performance
- Cache de permissões por usuário
- Índices otimizados para queries de autorização
- Lazy loading de policies

### Compatibilidade
- Manter APIs existentes funcionando
- Migração gradual do sistema atual
- Fallback para permissões básicas

### Segurança
- Validação rigorosa de recursos e ações
- Sanitização de inputs
- Rate limiting para verificações de permissão
