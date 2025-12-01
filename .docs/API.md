# API Documentation

## Accounts API

### Create Account

Cria uma nova conta no sistema.

**Endpoint:** `POST /api/core/v1/realm/{tenantId}/accounts`

**Headers:**

- `Content-Type: application/json`

**Body Parameters:**

- `email` (string, required): Email válido da conta
- `password` (string, required): Senha com pelo menos 8 caracteres, contendo:
  - 1 letra minúscula
  - 1 letra maiúscula
  - 1 número
  - 1 caractere especial

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/realm/4565ebbb-c38b-46b7-890c-84b8b103c6c7/v1/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@idm-auth.io",
    "password": "MySecure123!"
  }'
```

**Success Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@idm-auth.io"
}
```

### Other Endpoints

- `GET /api/core/v1/realm/{tenantId}/accounts/{id}` - Buscar conta por ID
- `PUT /api/core/v1/realm/{tenantId}/accounts/{id}` - Atualizar conta
- `DELETE /api/core/v1/realm/{tenantId}/accounts/{id}` - Remover conta

## Groups API

- `POST /api/core/v1/realm/{tenantId}/groups` - Criar grupo
- `GET /api/core/v1/realm/{tenantId}/groups/{id}` - Buscar grupo por ID
- `PUT /api/core/v1/realm/{tenantId}/groups/{id}` - Atualizar grupo
- `DELETE /api/core/v1/realm/{tenantId}/groups/{id}` - Remover grupo

## Roles API

- `POST /api/core/v1/realm/{tenantId}/roles` - Criar role
- `GET /api/core/v1/realm/{tenantId}/roles/{id}` - Buscar role por ID
- `PUT /api/core/v1/realm/{tenantId}/roles/{id}` - Atualizar role
- `DELETE /api/core/v1/realm/{tenantId}/roles/{id}` - Remover role

## Policies API

- `POST /api/core/v1/realm/{tenantId}/policies` - Criar policy
- `GET /api/core/v1/realm/{tenantId}/policies/{id}` - Buscar policy por ID
- `PUT /api/core/v1/realm/{tenantId}/policies/{id}` - Atualizar policy
- `DELETE /api/core/v1/realm/{tenantId}/policies/{id}` - Remover policy

## Account-Groups API

- `POST /api/core/v1/realm/{tenantId}/account-groups` - Adicionar conta ao grupo
- `DELETE /api/core/v1/realm/{tenantId}/account-groups` - Remover conta do grupo
- `PUT /api/core/v1/realm/{tenantId}/account-groups` - Atualizar role da conta no grupo
- `GET /api/core/v1/realm/{tenantId}/account-groups/account/{accountId}` - Listar grupos da conta
- `GET /api/core/v1/realm/{tenantId}/account-groups/group/{groupId}` - Listar contas do grupo

## Account-Roles API

- `POST /api/core/v1/realm/{tenantId}/account-roles` - Adicionar role à conta
- `DELETE /api/core/v1/realm/{tenantId}/account-roles` - Remover role da conta
- `GET /api/core/v1/realm/{tenantId}/account-roles/account/{accountId}` - Listar roles da conta
- `GET /api/core/v1/realm/{tenantId}/account-roles/role/{roleId}` - Listar contas com o role

## Group-Roles API

- `POST /api/core/v1/realm/{tenantId}/group-roles` - Adicionar role ao grupo
- `DELETE /api/core/v1/realm/{tenantId}/group-roles` - Remover role do grupo
- `GET /api/core/v1/realm/{tenantId}/group-roles/group/{groupId}` - Listar roles do grupo
- `GET /api/core/v1/realm/{tenantId}/group-roles/role/{roleId}` - Listar grupos com o role
