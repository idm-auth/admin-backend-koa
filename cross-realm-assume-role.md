# Cross-Realm: Assume Role Implementation

## Visão Geral

Implementação de troca explícita de realm (Assume Role) usando **Trust Relationships** configuradas nas Roles. Similar ao AWS IAM, uma Role pode confiar em usuários de outras realms através de Trust Policies.

## Conceito: Trust Relationships

**Trust Relationship** define quem pode assumir uma role:
- Configurado na própria Role (campo `trustRelationships`)
- Especifica quais realms são confiáveis
- Pode incluir condições adicionais (ex: apenas certos roles da realm de origem)

## Arquitetura

### Fluxo de Assume Role

```
1. Usuário faz login em Realm A
   → Recebe token JWT com { accountId, realmPublicUUID: 'realm-a-uuid' }
   → Usuário tem Role "Developer" na Realm A

2. Usuário solicita assume role na Realm B
   → POST /auth/assume-role { targetRealmPublicUUID: 'realm-b-uuid', targetRoleId: 'role-id' }
   → Header: Authorization: Bearer <token-realm-a>

3. Sistema valida:
   → Token é válido?
   → Realm B existe?
   → Role existe na Realm B?
   → Role tem Trust Relationship que permite Realm A?
   → (Opcional) Usuário tem role permitida na Realm A?

4. Sistema retorna novo token
   → Novo JWT com { accountId, realmPublicUUID: 'realm-b-uuid', assumedRoleId: 'role-id' }
   → Token assinado com secret da Realm B
   → Usuário agora tem permissões da role assumida
```

## Mudanças Necessárias

### 1. JWT Payload - Adicionar realmPublicUUID

**Arquivo:** `src/domain/realm/jwt/jwt.dto.ts`

```typescript
export type JwtPayload = {
  accountId: string;
  realmPublicUUID: string; // publicUUID da realm
};
```

### 2. JWT Service - Incluir realmPublicUUID no token

**Arquivo:** `src/domain/realm/jwt/jwt.service.ts`

**Mudanças:**
- Métodos `generateToken()` e `generateRefreshToken()` devem receber `realmPublicUUID` no payload
- Método `verifyToken()` já retorna o payload completo (incluirá `realmPublicUUID`)

### 3. Authentication Service - Passar realmPublicUUID ao gerar token

**Arquivo:** `src/domain/realm/authentication/authentication.service.ts`

**Mudanças no método `login()`:**
- Obter `realmPublicUUID` do ExecutionContext (tenant atual)
- Passar `realmPublicUUID` ao gerar tokens:
  ```typescript
  const token = await this.jwtService.generateToken({ 
    accountId: account._id.toString(),
    realmPublicUUID: this.executionContext.getTenantId()
  });
  ```

### 4. Modificar Role Entity - Adicionar Trust Relationships

**Arquivo:** `src/domain/realm/role/role.entity.ts`

**Adicionar campo `trustPolicy`:**

```typescript
export type TrustPolicyStatement = {
  effect: 'Allow' | 'Deny';
  principal: {
    idmAuth: string;  // Format: "idmauth:realm:{realmPublicUUID}"
  };
  action: 'idmauth:AssumeRole';
};

export type TrustPolicy = {
  version: string;  // Ex: "2024-01-17"
  statement: TrustPolicyStatement[];
};

export type Role = {
  name: string;
  description?: string;
  permissions: string[];
  trustPolicy?: TrustPolicy;  // NOVO: Trust policy (similar ao AWS IAM)
};
```

**Exemplo de Role com Trust Policy:**
```typescript
{
  name: "ProjectManager",
  description: "Gerente de projeto com acesso cross-realm",
  permissions: ["project:read", "project:write"],
  trustPolicy: {
    version: "2024-01-17",
    statement: [
      {
        effect: "Allow",
        principal: {
          idmAuth: "idmauth:realm:realm-a-uuid"  // Permite Realm A
        },
        action: "idmauth:AssumeRole"
      },
      {
        effect: "Allow",
        principal: {
          idmAuth: "idmauth:realm:realm-c-uuid"  // Permite Realm C
        },
        action: "idmauth:AssumeRole"
      }
    ]
  }
}
```

**Formato do Principal:**
- `idmauth:realm:{realmPublicUUID}` - Permite qualquer usuário da realm
- Futuro: `idmauth:realm:{realmPublicUUID}:account:{accountId}` - Usuário específico
- Futuro: `idmauth:realm:{realmPublicUUID}:role/{roleName}` - Apenas usuários com role específica

### 5. Novo Endpoint: Assume Role

**Arquivo:** `src/domain/realm/authentication/authentication.controller.ts`

**Novo endpoint:**
```typescript
POST /auth/assume-role
Headers: Authorization: Bearer <current-token>
Body: { 
  targetRealmPublicUUID: string,
  targetRoleId: string  // ID da role que quer assumir
}
Response: { 
  token: string, 
  refreshToken: string, 
  realm: RealmDto,
  assumedRole: RoleDto 
}
```

**Lógica:**
1. Extrair token do header
2. Verificar token e extrair `accountId` e `realmPublicUUID` (source)
3. Validar se targetRealmPublicUUID existe
4. Buscar Role na target realm
5. **Validar Trust Policy:**
   - Role tem `trustPolicy`?
   - Existe statement com effect="Allow" para a realm de origem?
   - Principal match: `idmauth:realm:{sourceRealmPublicUUID}`
6. Gerar novo token com `assumedRoleId`
7. Retornar novo token

### 6. Novo Endpoint: List Assumable Roles

**Arquivo:** `src/domain/realm/authentication/authentication.controller.ts`

**Novo endpoint:**
```typescript
GET /auth/assumable-roles
Headers: Authorization: Bearer <current-token>
Response: { 
  roles: Array<{
    realmPublicUUID: string,
    realmName: string,
    roleId: string,
    roleName: string,
    permissions: string[]
  }>
}
```

**Lógica:**
1. Extrair accountId e realmPublicUUID do token
2. Buscar roles do usuário na realm atual
3. Buscar todas as roles de todas as realms que têm trust policy permitindo a realm atual
4. Filtrar roles baseado no trust policy
5. Retornar lista de roles assumíveis

### 7. Authentication Service - Novos métodos

**Arquivo:** `src/domain/realm/authentication/authentication.service.ts`

**Novos métodos:**
```typescript
async assumeRole(
  currentToken: string, 
  targetRealmPublicUUID: string,
  targetRoleId: string
): Promise<LoginResponse>

async listAssumableRoles(currentToken: string): Promise<AssumableRoleDto[]>
```

### 8. Role Service - Novo método

**Arquivo:** `src/domain/realm/role/role.service.ts`

**Novo método:**
```typescript
async canAssumeRole(
  roleId: DocId,
  sourceRealmPublicUUID: string
): Promise<boolean>
```

**Lógica:**
1. Buscar role pelo ID
2. Verificar se tem `trustPolicy`
3. Iterar pelos statements do trust policy
4. Procurar statement com:
   - `effect: "Allow"`
   - `action: "idmauth:AssumeRole"`
   - `principal.idmAuth: "idmauth:realm:{sourceRealmPublicUUID}"`
5. Retornar true se encontrar, false caso contrário

### 9. Desafio: Verificar Token de Outra Realm

**Problema:** 
- Token foi gerado com secret da Realm A
- Estamos na Realm B tentando verificar o token
- Cada realm tem seu próprio JWT secret

**Solução:**
- JWT Service precisa de método para verificar token de outra realm
- Buscar secret da realm de origem para validar

**Novo método no JwtService:**
```typescript
async verifyTokenFromRealm(token: string, sourceRealmPublicUUID: string): Promise<JwtPayload>
```

**Implementação:**
1. Buscar Realm pelo publicUUID (sourceRealmPublicUUID)
2. Usar secret dessa realm para verificar token
3. Retornar payload

**Dependência adicional:**
- JwtService precisa injetar RealmService (do core)
- Problema: JwtService é multi-tenant, RealmService é singleton
- Solução: Injetar Container e resolver RealmService dinamicamente

### 10. JWT Payload - Adicionar assumedRoleId

**Atualizar JWT Payload:**
```typescript
export type JwtPayload = {
  accountId: string;
  realmPublicUUID: string;
  assumedRoleId?: string;  // NOVO: ID da role assumida (se for cross-realm)
};
```

**Quando usar:**
- Login normal: `assumedRoleId` é `undefined`
- Assume role: `assumedRoleId` contém o ID da role assumida

### 11. Middleware de Autenticação (Futuro)

**Não implementar agora, mas considerar:**
- Middleware que valida token e extrai accountId + realmPublicUUID
- Coloca no `ctx.state.auth = { accountId, realmPublicUUID }`
- Controllers usam `ctx.state.auth` ao invés de validar token manualmente

## Estrutura de Arquivos

```
src/domain/realm/
├── role/
│   ├── role.entity.ts                  [MODIFICAR - adicionar trustPolicy]
│   ├── role.service.ts                 [MODIFICAR - adicionar canAssumeRole()]
│   └── ...
├── authentication/
│   ├── authentication.controller.ts    [MODIFICAR - adicionar endpoints]
│   ├── authentication.service.ts       [MODIFICAR - adicionar métodos]
│   ├── authentication.dto.ts           [MODIFICAR - adicionar DTOs]
│   └── ...
└── jwt/
    ├── jwt.dto.ts                       [MODIFICAR - adicionar assumedRoleId]
    └── jwt.service.ts                   [MODIFICAR - adicionar verifyTokenFromRealm()]
```

## Ordem de Implementação

1. **Modificar JWT Payload** (jwt.dto.ts)
   - Adicionar `realmPublicUUID`
   - Adicionar `assumedRoleId` (opcional)

2. **Modificar JWT Service** (jwt.service.ts)
   - Adicionar método `verifyTokenFromRealm()`
   - Atualizar `generateToken()` para aceitar `assumedRoleId`

3. **Modificar Authentication Service** (authentication.service.ts)
   - Atualizar método `login()` para incluir realmPublicUUID

4. **Modificar Role Entity** (role.entity.ts)
   - Adicionar campo `trustPolicy`

5. **Modificar Role Service** (role.service.ts)
   - Adicionar método `canAssumeRole()`

6. **Adicionar métodos no Authentication Service**
   - `assumeRole()`
   - `listAssumableRoles()`

7. **Adicionar endpoints no Authentication Controller**
   - `POST /auth/assume-role`
   - `GET /auth/assumable-roles`

8. **Testes**

## Considerações de Segurança

1. **Validação de Token:**
   - Sempre verificar token com secret da realm de origem
   - Nunca confiar em payload sem verificação

2. **Autorização:**
   - Verificar Trust Policy antes de gerar novo token
   - Trust é configurado na Role, não por usuário individual
   - Apenas statements com effect="Allow" são considerados

3. **Auditoria:** configurado na Role, não por usuário individual

3. **Auditoria:**
   - Logar todas as trocas de realm (assume role)
   - Incluir: accountId, sourceRealmPublicUUID, targetRealmPublicUUID, timestamp

4. **Rate Limiting:**
   - Considerar limitar número de assume role por período
   - Prevenir abuso

## Exemplo de Uso

```bash
# 1. Admin da Realm B configura Role com Trust Policy
POST /api/realm-b-uuid/roles
Body: {
  name: "ProjectManager",
  permissions: ["project:read", "project:write"],
  trustPolicy: {
    version: "2024-01-17",
    statement: [
      {
        effect: "Allow",
        principal: { idmAuth: "idmauth:realm:realm-a-uuid" },
        action: "idmauth:AssumeRole"
      }
    ]
  }
}

# 2. Usuário faz login em Realm A
POST /api/realm-a-uuid/auth/login
Body: { email: "user@example.com", password: "pass123" }
Response: { 
  token: "eyJhbG...", 
  realmPublicUUID: "realm-a-uuid",
  roles: ["Developer"]
}

# 3. Listar roles assumíveis
GET /api/realm-a-uuid/auth/assumable-roles
Headers: Authorization: Bearer eyJhbG...
Response: { 
  roles: [
    {
      realmPublicUUID: "realm-b-uuid",
      realmName: "Realm B",
      roleId: "role-123",
      roleName: "ProjectManager",
      permissions: ["project:read", "project:write"]
    }
  ]
}

# 4. Assumir Role na Realm B
POST /api/realm-a-uuid/auth/assume-role
Headers: Authorization: Bearer eyJhbG...
Body: { 
  targetRealmPublicUUID: "realm-b-uuid",
  targetRoleId: "role-123"
}
Response: { 
  token: "eyJzdW...", 
  realmPublicUUID: "realm-b-uuid",
  assumedRole: { id: "role-123", name: "ProjectManager" }
}

# 5. Usar novo token em Realm B com permissões da role assumida
GET /api/realm-b-uuid/projects
Headers: Authorization: Bearer eyJzdW...
Response: { projects: [...] }
```

## Vantagens desta Abordagem

1. **Descentralizado:** Cada realm controla quem pode assumir suas roles
2. **Padrão AWS IAM:** Usa mesma estrutura de Trust Policy do AWS
3. **Seguro:** Trust é explícito e configurável
4. **Escalável:** Não precisa gerenciar permissões por usuário
5. **Extensível:** Fácil adicionar conditions no futuro (como AWS)
6. **Familiar:** Desenvolvedores que conhecem AWS IAM entendem imediatamente

## Perguntas em Aberto

1. **Account existe em ambas as realms?**
   - **Decisão:** Account só existe na realm de origem
   - Outras realms aceitam via trust relationship
   - Não há replicação de dados

2. **Permissões cross-realm:**
   - **Decisão:** Usuário assume role da target realm
   - Permissões vêm da role assumida, não da role original
   - Mais flexível e seguro

3. **Quem gerencia Trust Policy?**
   - **Decisão:** Admin da realm de destino (que está sendo acessada)
   - Admin configura trust policy nas roles
   - Realm de origem não precisa fazer nada

4. **Formato do Principal:**
   - **Fase 1:** Apenas `idmauth:realm:{realmPublicUUID}` (qualquer usuário da realm)
   - **Futuro:** Adicionar suporte para account específico, role específica, etc
   - **Futuro:** Adicionar Conditions (como AWS: StringEquals, DateLessThan, etc) - Ambos?
   - **Recomendação:** Admin da realm de origem concede, admin de destino pode revogar

4. **Refresh token cross-realm:**
   - Refresh token também deve ter realmPublicUUID?
   - Pode fazer refresh em outra realm?
   - **Recomendação:** Sim, refresh token também tem realmPublicUUID, só pode refresh na mesma realm

## Próximos Passos

Após implementação básica, considerar:

1. **Realm Federation (Trust):** Configuração de trust automático entre realms
2. **SSO (Single Sign-On):** Login único para múltiplas realms
3. **Audit Log:** Rastreamento completo de assume role
4. **Permissions Mapping:** Mapear permissões entre realms
5. **Token Expiration:** Tokens cross-realm com expiração menor
