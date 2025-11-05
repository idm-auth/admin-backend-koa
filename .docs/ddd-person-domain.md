# Domínio Person - DDD Architecture

## Conceito

O domínio **Person** representa uma pessoa física no sistema, sendo uma entidade de nível superior que pode ter múltiplas contas (accounts) em diferentes contextos/tenants.

## Relacionamento com Accounts

### Estrutura Hierárquica
```
Person (Pessoa Física)
├── Account 1 (Tenant A)
├── Account 2 (Tenant B)
└── Account N (Tenant N)
```

### Casos de Uso
- **Funcionário Multi-empresa**: Uma pessoa que trabalha em várias empresas
- **Consultor**: Profissional que atende múltiplos clientes
- **Usuário Multi-plataforma**: Pessoa com contas em diferentes sistemas
- **Administrador Global**: Gestor com acesso a múltiplos tenants

## Estrutura do Domínio

### Localização
```
src/domains/core/persons/
├── latest/
│   ├── person.controller.ts
│   ├── person.service.ts
│   ├── person.model.ts
│   ├── person.schema.ts
│   └── person.routes.ts
└── v1/
    └── (re-exports do latest)
```

### Campos Principais
```typescript
interface Person {
  _id: string;           // UUID da pessoa
  name: string;          // Nome completo
  document?: string;     // CPF, RG, ou documento de identificação
  phone?: string;        // Telefone principal
  birthDate?: Date;      // Data de nascimento
  accounts: string[];    // Array de IDs das contas associadas
  createdAt: Date;
  updatedAt: Date;
}
```

## Relacionamentos

### Person → Account (1:N)
- Uma pessoa pode ter múltiplas contas
- Cada conta pertence a um tenant específico
- Relacionamento mantido via array `accounts` na Person

### Account → Person (N:1)
- Cada account referencia uma Person via `personId`
- Account continua sendo tenant-scoped
- Person é global (não tenant-scoped)

## Implementação

### Database Strategy
```typescript
// Person - Banco global (não tenant-scoped)
const personSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  document: { type: String, unique: true, sparse: true },
  phone: String,
  birthDate: Date,
  accounts: [{ type: String }], // Array de Account IDs
});

// Account - Continua tenant-scoped, adiciona personId
const accountSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  personId: { type: String, required: true }, // Referência à Person
  email: { type: String, required: true },
  // ... outros campos
});
```

### Service Pattern
```typescript
// Person service - SEM tenantId (global)
export const create = async (data: PersonCreate): Promise<PersonDocument> => {
  // Implementação global
};

export const findById = async (id: string): Promise<PersonDocument> => {
  // Busca global
};

// Account service - COM tenantId (mantém padrão atual)
export const create = async (
  tenantId: string,
  data: AccountCreate & { personId: string }
): Promise<AccountDocument> => {
  // Implementação tenant-scoped
};
```

## APIs

### Person APIs (Globais)
```
POST   /api/core/persons              # Criar pessoa
GET    /api/core/persons/:id          # Buscar pessoa
PUT    /api/core/persons/:id          # Atualizar pessoa
DELETE /api/core/persons/:id          # Remover pessoa
GET    /api/core/persons/:id/accounts # Listar contas da pessoa
```

### Account APIs (Tenant-scoped - mantém atual)
```
POST   /api/core/v1/realm/:tenantId/accounts  # Criar conta (+ personId)
GET    /api/core/v1/realm/:tenantId/accounts  # Listar contas do tenant
```

## Benefícios

### Unificação de Identidade
- Visão única da pessoa across tenants
- Histórico completo de relacionamentos
- Facilita auditoria e compliance

### Flexibilidade
- Pessoa pode ter contas em múltiplos tenants
- Permite migração de contas entre tenants
- Suporte a cenários complexos de negócio

### Integridade de Dados
- Evita duplicação de dados pessoais
- Centraliza informações de identificação
- Facilita atualizações de dados pessoais

## Considerações de Implementação

### Segurança
- Person é entidade global - cuidado com acesso
- Validar permissões antes de expor dados
- Logs de auditoria para operações Person

### Performance
- Índices apropriados para document/phone
- Cache para relacionamentos Person-Account
- Paginação para listagem de accounts

### Migração
- Criar Persons para Accounts existentes
- Atualizar Accounts com personId
- Manter compatibilidade durante transição

## Próximos Passos

1. **Implementar domínio Person** seguindo padrão DDD
2. **Atualizar Account schema** para incluir personId
3. **Criar APIs Person** (globais, sem tenant)
4. **Implementar relacionamentos** Person ↔ Account
5. **Migração de dados** existentes
6. **Testes de integração** para novos fluxos
7. **Documentação de APIs** no Swagger
