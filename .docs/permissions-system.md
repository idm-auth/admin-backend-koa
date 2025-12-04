# Sistema de Permissões - IAM Model

## Visão Geral

Sistema de controle de acesso baseado em políticas (Policy-Based Access Control) inspirado no AWS IAM, combinado com RBAC (Role-Based Access Control) para gerenciamento simplificado.

**Este sistema é um IAM Provider** que permite às empresas gerenciar permissões de múltiplas aplicações de forma centralizada.

## Multi-Tenancy

**IMPORTANTE**: Este sistema opera com isolamento completo por tenant.

### Tenant (Contexto de Isolamento)
- **O que é**: A empresa/organização que usa o sistema IAM
- **Exemplo**: "Empresa XYZ" usa o IAM para gerenciar permissões de suas aplicações
- **Isolamento**: Cada tenant tem seus próprios dados completamente isolados
- **URL**: `/api/realm/{tenantId}/...`
- **Uso**: O mesmo `tenantId` é usado tanto para gerenciar o próprio IAM quanto para gerenciar aplicações externas

### Auto-Gerenciamento
O IAM usa ele mesmo para se auto-gerenciar:
- Quando gerencia contas do IAM → `tenantId` identifica a empresa
- Quando gerencia recursos de apps → `tenantId` identifica o contexto (pode ser a empresa ou cliente dela)

### Exemplo Prático
```
Empresa XYZ (tenantId: company-xyz) usa o IAM
├── Gerencia próprio IAM
│   ├── Accounts (tenantId: company-xyz)
│   ├── Roles (tenantId: company-xyz)
│   └── Policies (tenantId: company-xyz)
├── Aplicação CRM
│   ├── Contexto Empresa (tenantId: company-xyz)
│   └── Contexto Cliente A (tenantId: client-a)
└── Aplicação Billing
    ├── Contexto Empresa (tenantId: company-xyz)
    └── Contexto Cliente B (tenantId: client-b)
```

## Modelo de Permissão

### Componentes Principais

```
Account (Quem?)
    ↓
Role/Group (Agrupamento)
    ↓
Policy (Regras)
    ↓
Effect + Action + Resource
```

## Estrutura de Policy

### Anatomia de uma Policy

```json
{
  "version": "1",
  "name": "UserManagementPolicy",
  "description": "Permite gerenciar usuários no IAM",
  "effect": "Allow",
  "actions": [
    "iam:accounts:create",
    "iam:accounts:read",
    "iam:accounts:update"
  ],
  "resources": [
    "grn:global:iam::${tenantId}:accounts/*"
  ]
}
```

### Campos Obrigatórios

#### 0. Version (Versão)
**Valor:** `"1"` (string)

- **Propósito**: Controle de versão do formato da policy
- **Atual**: Versão `"1"` - formato inicial com GRN e estrutura completa
- **Futuro**: Permite evolução do formato sem quebrar policies existentes
- **Obrigatório**: Sim - todas as policies devem declarar a versão

**Por que string e não número?**
- Compatibilidade com JSON (evita problemas de precisão)
- Permite versões como "1.1", "2.0-beta" no futuro
- Padrão seguido por AWS IAM e outros sistemas

#### 1. Effect (Efeito)
**Valores:** `Allow` | `Deny`

- **Allow**: Concede permissão explícita
- **Deny**: Nega permissão explícita (tem precedência sobre Allow)

**Regra de Avaliação:**
```
Deny explícito > Allow explícito > Deny implícito (padrão)
```

#### 2. Actions (Ações)
**Formato:** `{sistema}:{recurso}:{operação}`

**Estrutura de 3 Níveis:**
1. **Sistema** - Qual sistema/aplicação (backend, frontend, mobile, microserviço, etc.)
2. **Recurso** - Qual recurso/entidade dentro do sistema
3. **Operação** - Qual ação será executada no recurso

**Por que este formato funciona:**
- Simples e fácil de entender
- Flexível para qualquer tipo de software (backend, frontend, mobile, etc.)
- Escalável com wildcards em qualquer nível
- Isolamento claro entre sistemas
- Extensível sem quebrar compatibilidade

**Recursos Aninhados:**
Para recursos com hierarquia, use ponto (.) como separador:
- `crm:customers.orders:read` - Ler pedidos de clientes
- `crm:customers.addresses:update` - Atualizar endereços de clientes
- `billing:invoices.items:create` - Criar itens de fatura

**Padrões de Ação:**
- `iam:accounts:create` - Criar conta no IAM
- `iam:accounts:read` - Ler conta no IAM
- `crm:customers:create` - Criar cliente no CRM
- `crm:customers.orders:read` - Ler pedidos de clientes no CRM
- `billing:invoices:read` - Ler faturas no Billing
- `analytics:reports:export-pdf` - Exportar relatório em PDF
- `mobile-app:notifications:send` - Enviar notificação no app mobile
- `frontend-admin:dashboard:view` - Visualizar dashboard no frontend
- `payment-service:transactions:process` - Processar transação no microserviço

**Operações Comuns Sugeridas:**
- CRUD: `create`, `read`, `update`, `delete`
- Consultas: `list`, `search`, `filter`
- Processamento: `execute`, `process`, `schedule`, `cancel`
- Comunicação: `send`, `receive`, `subscribe`, `unsubscribe`
- Frontend: `view`, `navigate`, `render`
- Exportação: `export-pdf`, `export-csv`, `export-json`
- Importação: `import`, `bulk-import`, `bulk-update`

**Exemplos:**
```json
"actions": [
  "iam:accounts:create",
  "iam:accounts:read",
  "crm:customers:*",
  "crm:customers.orders:read",
  "billing:invoices:read",
  "mobile-app:profile:update"
]
```

**Wildcards:**
- `iam:accounts:*` - Todas as operações em accounts do IAM
- `iam:*:read` - Leitura de todos os recursos do IAM
- `crm:*:*` - Todas as operações no CRM
- `*:customers:read` - Leitura de customers em todos os sistemas
- `*:*:*` - Todas as operações em todos os sistemas (super admin)

#### 3. Resources (Recursos)
**Formato GRN (Global Resource Name):** `grn:partition:sistema:region:tenantId:resource-type/resource-id`

**Estrutura Completa (6 partes):**
```
grn:partition:sistema:region:tenantId:resource-type/resource-id
 │      │       │       │        │            │
 │      │       │       │        │            └─ Tipo e ID do recurso
 │      │       │       │        └──────────────── Tenant (empresa ou cliente)
 │      │       │       └─────────────────────────── Região/Continente
 │      │       └─────────────────────────────────── Sistema/Aplicação
 │      └─────────────────────────────────────────── Partição/Esfera
 └────────────────────────────────────────────────── Prefixo (Global Resource Name)
```

**1. Partition (Partição/Esfera):**
Isolamento por tipo de organização/jurisdição:
- `global` - Esfera civil/comercial padrão (empresas, startups)
- `gov` - Esfera governamental (órgãos públicos, prefeituras)
- `mil` - Esfera militar/defesa (forças armadas, segurança nacional)
- `edu` - Esfera educacional (universidades, institutos) - opcional
- `*` - Todas as partições (wildcard)

**Por que importa:** Compliance, regulamentações, segurança, isolamento físico, auditoria.

**2. Sistema:**
Qual sistema/aplicação (mesmo conceito do Action):
- `iam` - Sistema IAM (próprio)
- `crm` - Sistema CRM
- `billing` - Sistema de faturamento
- `*` - Todos os sistemas (wildcard)

**3. Region (Região):**
Isolamento geográfico/continental:
- `americas` - Américas (Norte, Central, Sul)
- `europe` - Europa
- `asia` - Ásia
- `africa` - África
- `oceania` - Oceania
- `*` - Todas as regiões (wildcard)
- `` (vazio) - Recurso global (sem região específica)

**Por que importa:** LGPD, GDPR, residência de dados, latência.

**4. TenantId:**
Contexto de isolamento (empresa ou cliente):
- `company-xyz` - Empresa que usa o IAM
- `client-abc` - Cliente da aplicação
- `${tenantId}` - Variável dinâmica
- `*` - Todos os tenants (wildcard)

**5. Resource Type/ID:**
Tipo e identificador do recurso:
- `accounts/*` - Todas as contas
- `accounts/user-123` - Conta específica
- `customers/*` - Todos os customers
- `customers.orders/*` - Todos os pedidos de customers (aninhado)
- `*` - Todos os recursos (wildcard)

**Exemplos Práticos:**

```json
// Esfera Civil (Global)
"resources": [
  "grn:global:iam::company-xyz:accounts/*",
  "grn:global:crm:americas:company-xyz:customers/*",
  "grn:global:billing:europe:client-abc:invoices/*",
  "grn:global:crm:asia:client-abc:customers.orders/*"
]

// Esfera Governamental
"resources": [
  "grn:gov:iam::prefeitura-sp:accounts/*",
  "grn:gov:crm:americas:ministerio-saude:citizens/*",
  "grn:gov:billing:americas:receita-federal:taxes/*"
]

// Esfera Militar
"resources": [
  "grn:mil:iam::exercito-br:accounts/*",
  "grn:mil:operations:americas:comando-sul:missions/*"
]

// Wildcards Multi-Esfera
"resources": [
  "grn:*:*:*:*:*",                              // Super admin absoluto
  "grn:global:*:americas:company-xyz:*",        // Tudo da empresa nas Américas
  "grn:gov:*:*:prefeitura-sp:*",                // Tudo da prefeitura
  "grn:*:crm:americas:*:customers/*"             // Todos customers CRM nas Américas
]
```

**Variáveis Dinâmicas:**
- `${tenantId}` - Substituído pelo tenant atual
- `${accountId}` - Substituído pelo account autenticado
- `${region}` - Substituído pela região atual
- `${partition}` - Substituído pela partição atual

**Campos Opcionais:**
- **Region vazia** (`::`): Para recursos globais sem região específica
  - Exemplo: `grn:global:iam::company-xyz:accounts/*`
- **Wildcards** (`*`): Em qualquer posição para match amplo
  - Exemplo: `grn:*:crm:*:*:customers/*`

#### 4. Conditions (Condições) - Reservado para Futuro

**Status:** Campo reservado para implementação futura (MVP não inclui)

**Propósito:** Permitirá adicionar restrições contextuais às policies (IP, horário, localização, etc.)

**Formato:** Ainda não definido - será especificado em versões futuras

**Uso Atual:** Não utilize este campo na MVP - será ignorado pelo sistema de autorização

## Hierarquia de Permissões

### 1. Account (Quem?)
**Identificação:** `accountId`

Representa o usuário/identidade que está tentando executar uma ação.

```
Account: user@example.com (accountId: abc-123)
```

### 2. Tenant (Onde? - Contexto)
**Identificação:** `tenantId`

Contexto de isolamento:
- **Tenant**: Identifica o contexto de isolamento (empresa, cliente, organização)
- **Flexível**: Pode representar a empresa que usa o IAM ou clientes das aplicações dela

```
Tenant: company-xyz (tenantId: company-xyz)
Tenant: client-abc (tenantId: client-abc)
```

### 3. Resource (O quê? - Alvo)
**Identificação:** GRN completo

O recurso específico sendo acessado.

```
Resource: grn:global:iam::company-xyz:accounts/user-789
Resource: grn:global:crm:americas:client-abc:customers/customer-123
Resource: grn:gov:iam::prefeitura-sp:accounts/admin-456
```

### 4. Action (Como? - Operação)
**Identificação:** `{sistema}:{recurso}:{operação}`

A operação sendo executada no recurso de um sistema específico.

```
Action: iam:accounts:update
Action: crm:customers:create
Action: crm:customers.orders:read
Action: billing:invoices:read
Action: mobile-app:notifications:send
Action: frontend-admin:dashboard:view
```

## Fluxo de Autorização

### Processo de Avaliação

```
1. Autenticação
   ↓
   Extrair: accountId, tenantId, partition, region (da URL ou contexto)
   
2. Identificar Ação e Recurso
   ↓
   Action: iam:accounts:create
   Resource: grn:global:iam::${tenantId}:accounts/*
   
3. Buscar Policies Aplicáveis
   ↓
   Account → Roles → Policies
   Account → Groups → Roles → Policies
   
4. Avaliar Policies
   ↓
   a) Existe Deny explícito? → NEGAR
   b) Existe Allow explícito? → PERMITIR
   c) Nenhum match? → NEGAR (padrão)
   
5. Resultado Final
   ↓
   ALLOW ou DENY
```

### Exemplo Prático

**Cenário:**
```
Account: john@company.com (accountId: acc-123)
Tenant: company-xyz (tenantId: company-xyz)
Partition: global
Region: (vazio - recurso global)
Action: iam:accounts:create
Resource: grn:global:iam::company-xyz:accounts/*
```

**Policies Aplicadas:**

```json
// Policy 1 - Via Role "Admin"
{
  "name": "AdminFullAccess",
  "effect": "Allow",
  "actions": ["*:*:*"],
  "resources": ["grn:global:*:*:${tenantId}:*"]
}

// Policy 2 - Via Group "Developers"
{
  "name": "DenyAccountDelete",
  "effect": "Deny",
  "actions": ["iam:accounts:delete"],
  "resources": ["grn:global:iam::${tenantId}:accounts/*"]
}
```

**Avaliação:**
1. Action `iam:accounts:create` não tem Deny explícito ✓
2. Action `iam:accounts:create` tem Allow via Policy 1 (`*:*:*`) ✓
3. Resource match: `grn:global:*:*:company-xyz:*` cobre `iam::company-xyz:accounts/*` ✓

**Resultado:** ALLOW

## Estrutura de Dados

### Policy Document

```typescript
import { DocId } from '@/domains/commons/base/base.schema';

interface Policy {
  _id: DocId;
  name: string;
  description?: string;
  effect: 'Allow' | 'Deny';
  actions: string[];
  resources: string[];
  conditions?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Role Document

```typescript
import { DocId } from '@/domains/commons/base/base.schema';

interface Role {
  _id: DocId;
  name: string;
  description?: string;
  permissions: DocId[]; // Array de policyIds
  createdAt: Date;
  updatedAt: Date;
}
```

### Relacionamentos

```
Account ←→ Role (account-roles)
Account ←→ Group (account-groups)
Group ←→ Role (group-roles)
Role → Policy (via permissions array)
```

## Exemplos de Policies

### 1. Admin Completo (Todas as Aplicações)

```json
{
  "name": "AdminFullAccess",
  "description": "Acesso total a todas as aplicações do tenant",
  "effect": "Allow",
  "actions": ["*:*:*"],
  "resources": ["arn:tenant:${tenantId}:*"]
}
```

### 2. Admin do IAM

```json
{
  "name": "IAMAdmin",
  "description": "Acesso total ao sistema IAM",
  "effect": "Allow",
  "actions": ["backend-iam:*:*"],
  "resources": ["arn:tenant:${tenantId}:backend-iam:*"]
}
```

### 3. Gerenciador de Usuários (IAM)

```json
{
  "name": "IAMUserManager",
  "description": "Gerenciar contas de usuário no IAM",
  "effect": "Allow",
  "actions": [
    "backend-iam:accounts:create",
    "backend-iam:accounts:read",
    "backend-iam:accounts:update",
    "backend-iam:accounts:list"
  ],
  "resources": ["arn:tenant:${tenantId}:backend-iam:accounts/*"]
}
```

### 4. Somente Leitura (Todas as Apps)

```json
{
  "name": "ReadOnlyAccess",
  "description": "Acesso somente leitura em todas as aplicações",
  "effect": "Allow",
  "actions": ["*:*:read"],
  "resources": ["arn:tenant:${tenantId}:*"]
}
```

### 5. Negar Deleção (Todas as Apps)

```json
{
  "name": "DenyDelete",
  "description": "Impede deleção de qualquer recurso em todas as aplicações",
  "effect": "Deny",
  "actions": ["*:*:delete"],
  "resources": ["arn:tenant:${tenantId}:*"]
}
```

### 6. Acesso Restrito por Horário

```json
{
  "name": "BusinessHoursOnly",
  "description": "Acesso apenas em horário comercial",
  "effect": "Allow",
  "actions": ["*:*:*"],
  "resources": ["arn:tenant:${tenantId}:*"],
  "conditions": {
    "TimeOfDay": "09:00-18:00"
  }
}
```

### 7. Self-Service (Própria Conta)

```json
{
  "name": "SelfManagement",
  "description": "Usuário pode gerenciar própria conta no IAM",
  "effect": "Allow",
  "actions": [
    "backend-iam:accounts:read",
    "backend-iam:accounts:update"
  ],
  "resources": ["arn:tenant:${tenantId}:backend-iam:accounts/${accountId}"]
}
```

### 8. Acesso ao CRM

```json
{
  "name": "CRMFullAccess",
  "description": "Acesso total ao sistema CRM",
  "effect": "Allow",
  "actions": ["app-crm:*:*"],
  "resources": ["arn:tenant:${tenantId}:app-crm:*"]
}
```

### 9. Vendedor (CRM + Billing Read)

```json
{
  "name": "SalesRepresentative",
  "description": "Vendedor pode gerenciar clientes e ver faturas",
  "effect": "Allow",
  "actions": [
    "app-crm:customers:*",
    "app-crm:opportunities:*",
    "app-billing:invoices:read",
    "app-billing:invoices:list"
  ],
  "resources": ["arn:tenant:${tenantId}:*"]
}
```

### 10. Financeiro (Billing Full + CRM Read)

```json
{
  "name": "FinanceTeam",
  "description": "Equipe financeira gerencia billing e consulta CRM",
  "effect": "Allow",
  "actions": [
    "app-billing:*:*",
    "app-crm:customers:read",
    "app-crm:customers:list"
  ],
  "resources": ["arn:tenant:${tenantId}:*"]
}
```

## Padrões de Nomenclatura

### Actions
```
{application}:{resource}:{operation}

Aplicações:
- backend-iam (este sistema)
- app-crm (sistema CRM da empresa)
- app-billing (sistema de faturamento)
- app-analytics (sistema de analytics)
- app-* (outras aplicações)
- * (todas as aplicações)

Recursos (backend-iam):
- accounts
- groups
- roles
- policies
- account-groups
- account-roles
- group-roles

Recursos (app-crm):
- customers
- opportunities
- contacts
- deals

Recursos (app-billing):
- invoices
- payments
- subscriptions

Operações:
- create
- read
- update
- delete
- list
- search
- * (todas)

Exemplos:
- backend-iam:accounts:create
- app-crm:customers:read
- app-billing:invoices:*
- backend-iam:*:read
- *:*:read (leitura em todas as apps)
```

### Resources (ARN)
```
arn:tenant:{tenantId}:{application}:{resource-type}/{resource-id}

Exemplos:
- arn:tenant:abc-123:backend-iam:accounts/*
- arn:tenant:abc-123:backend-iam:accounts/user-456
- arn:tenant:abc-123:app-crm:customers/*
- arn:tenant:abc-123:app-billing:invoices/inv-789
- arn:tenant:abc-123:*:* (todos os recursos de todas as apps)
- arn:tenant:*:*:* (super admin global)
```

## Implementação Futura

### Policy Engine

```typescript
import { DocId } from '@/domains/commons/base/base.schema';

interface AuthorizationRequest {
  accountId: DocId;
  tenantId: DocId;
  action: string;
  resource: string;
  context?: {
    ipAddress?: string;
    userAgent?: string;
    timestamp?: Date;
  };
}

interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  matchedPolicies?: string[];
}

async function authorize(
  request: AuthorizationRequest
): Promise<AuthorizationResult> {
  // 1. Buscar todas as policies aplicáveis
  const policies = await getPoliciesForAccount(
    request.tenantId,
    request.accountId
  );
  
  // 2. Avaliar Deny explícito
  const denyPolicies = evaluatePolicies(policies, 'Deny', request);
  if (denyPolicies.length > 0) {
    return { allowed: false, reason: 'Explicit Deny' };
  }
  
  // 3. Avaliar Allow explícito
  const allowPolicies = evaluatePolicies(policies, 'Allow', request);
  if (allowPolicies.length > 0) {
    // 4. Verificar conditions
    const conditionsMet = checkConditions(allowPolicies, request.context);
    if (conditionsMet) {
      return { allowed: true, matchedPolicies: allowPolicies.map(p => p.name) };
    }
  }
  
  // 5. Deny implícito (padrão)
  return { allowed: false, reason: 'Implicit Deny (default)' };
}
```

### Middleware de Autorização

```typescript
export const authorize = (action: string, resourcePattern: string) => {
  return async (ctx: Context, next: Next) => {
    const { accountId, tenantId } = ctx.state.auth;
    
    const resource = buildResourceArn(
      tenantId,
      resourcePattern,
      ctx.params
    );
    
    const result = await authorizationEngine.authorize({
      accountId,
      tenantId,
      action,
      resource,
      context: {
        ipAddress: ctx.ip,
        userAgent: ctx.headers['user-agent'],
        timestamp: new Date(),
      },
    });
    
    if (!result.allowed) {
      throw new ForbiddenError(result.reason);
    }
    
    await next();
  };
};

// Uso nas rotas
router.post({
  path: '/accounts',
  handlers: [
    authenticate(),
    authorize('backend-iam:accounts:create', 'backend-iam:accounts/*'),
    controller.create
  ],
});
```

## Aplicações Multi-Sistema

### Cenário Real: Empresa com Múltiplas Aplicações

**Aplicações da Empresa:**
- `backend-iam` - Sistema de autenticação e autorização (este)
- `app-crm` - Sistema de CRM
- `app-billing` - Sistema de faturamento
- `app-analytics` - Sistema de analytics
- `app-inventory` - Sistema de estoque

### Exemplo: Perfil de Vendedor

**Role:** Sales Representative

**Policies Aplicadas:**

```json
// Policy 1: Acesso ao CRM
{
  "name": "CRMAccess",
  "effect": "Allow",
  "actions": [
    "app-crm:customers:*",
    "app-crm:opportunities:*",
    "app-crm:contacts:*"
  ],
  "resources": ["arn:tenant:${tenantId}:app-crm:*"]
}

// Policy 2: Leitura de Faturas
{
  "name": "BillingReadOnly",
  "effect": "Allow",
  "actions": [
    "app-billing:invoices:read",
    "app-billing:invoices:list"
  ],
  "resources": ["arn:tenant:${tenantId}:app-billing:invoices/*"]
}

// Policy 3: Consulta de Estoque
{
  "name": "InventoryReadOnly",
  "effect": "Allow",
  "actions": ["app-inventory:products:read"],
  "resources": ["arn:tenant:${tenantId}:app-inventory:products/*"]
}

// Policy 4: Sem acesso ao IAM
{
  "name": "DenyIAMAccess",
  "effect": "Deny",
  "actions": ["backend-iam:*:*"],
  "resources": ["arn:tenant:${tenantId}:backend-iam:*"]
}
```

**Resultado:**
- ✅ Pode gerenciar clientes no CRM
- ✅ Pode ver faturas no Billing
- ✅ Pode consultar produtos no Inventory
- ❌ Não pode acessar configurações do IAM

### Exemplo: Perfil de Admin de Aplicação

**Role:** CRM Administrator

```json
{
  "name": "CRMAdminAccess",
  "effect": "Allow",
  "actions": ["app-crm:*:*"],
  "resources": ["arn:tenant:${tenantId}:app-crm:*"]
}
```

**Resultado:**
- ✅ Acesso total ao CRM
- ❌ Sem acesso a outras aplicações

### Exemplo: Perfil de Super Admin

**Role:** Platform Administrator

```json
{
  "name": "PlatformFullAccess",
  "effect": "Allow",
  "actions": ["*:*:*"],
  "resources": ["arn:tenant:${tenantId}:*"]
}
```

**Resultado:**
- ✅ Acesso total a todas as aplicações do tenant = ctx.state.auth;
    
    const resource = buildResourceArn(
      tenantId,
      resourcePattern,
      ctx.params
    );
    
    const result = await authorizationEngine.authorize({
      accountId,
      tenantId,
      action,
      resource,
      context: {
        ipAddress: ctx.ip,
        userAgent: ctx.headers['user-agent'],
        timestamp: new Date(),
      },
    });
    
    if (!result.allowed) {
      throw new ForbiddenError(result.reason);
    }
    
    await next();
  };
};

// Uso nas rotas
router.post({
  path: '/accounts',
  handlers: [
    authenticate(),
    authorize('accounts:create', 'accounts/*'),
    controller.create
  ],
});
```

## Casos de Uso

### 1. Admin do Tenant (Todas as Apps)
```
Role: TenantAdmin
Policy: AdminFullAccess
  - Effect: Allow
  - Actions: *:*:*
  - Resources: arn:tenant:${tenantId}:*
```

### 2. Gerente de RH (IAM + CRM)
```
Role: HRManager
Policies:
  - IAMUserManagement (Allow backend-iam:accounts:*)
  - IAMGroupManagement (Allow backend-iam:groups:*)
  - CRMEmployeeAccess (Allow app-crm:employees:*)
  - DenyRoleChanges (Deny backend-iam:roles:*)
```

### 3. Desenvolvedor (Read-Only Multi-App)
```
Role: Developer
Policies:
  - ReadOnlyAccess (Allow *:*:read)
  - SelfManagement (Allow backend-iam:accounts:update para própria conta)
  - BusinessHoursOnly (Conditions: TimeOfDay)
```

### 4. Auditor (Read-Only Todas as Apps)
```
Role: Auditor
Policy: AuditAccess
  - Effect: Allow
  - Actions: *:*:read, *:*:list
  - Resources: arn:tenant:${tenantId}:*
```

### 5. Vendedor (CRM + Billing Read)
```
Role: SalesRep
Policies:
  - CRMFullAccess (Allow app-crm:*:*)
  - BillingReadOnly (Allow app-billing:invoices:read)
  - DenyIAMAccess (Deny backend-iam:*:*)
```

### 6. Financeiro (Billing Full)
```
Role: FinanceTeam
Policies:
  - BillingFullAccess (Allow app-billing:*:*)
  - CRMCustomerRead (Allow app-crm:customers:read)
  - DenyIAMAccess (Deny backend-iam:*:*)
```

## Segurança

### Princípios

1. **Least Privilege**: Conceder apenas permissões necessárias
2. **Deny by Default**: Tudo negado por padrão
3. **Explicit Deny Wins**: Deny sempre tem precedência
4. **Separation of Duties**: Usar múltiplas policies para controle granular

### Boas Práticas

- Nunca usar `*:*:*` em produção exceto para super admin
- Sempre especificar a aplicação no action: `app-name:resource:action`
- Sempre especificar resources específicos quando possível
- Usar conditions para adicionar camadas de segurança
- Revisar policies regularmente
- Auditar todas as mudanças de permissões
- Usar grupos para gerenciar permissões de múltiplos usuários

## Referências

- AWS IAM Policies: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
- AWS IAM Policy Evaluation Logic: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
