# API Documentation

## Users API

### Create User

Cria um novo usuário no sistema.

**Endpoint:** `POST /api/core/v1/realm/{tenantId}/users`

**Headers:**

- `Content-Type: application/json`

**Body Parameters:**

- `email` (string, required): Email válido do usuário
- `password` (string, required): Senha com pelo menos 8 caracteres, contendo:
  - 1 letra minúscula
  - 1 letra maiúscula
  - 1 número
  - 1 caractere especial

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/core/v1/realm/4565ebbb-c38b-46b7-890c-84b8b103c6c7/users \
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
  "email": "user@example.com"
}
```

### Other Endpoints

- `GET /api/core/v1/realm/{tenantId}/users/search?email={email}` - Buscar usuário por email
- `GET /api/core/v1/realm/{tenantId}/users/{id}` - Buscar usuário por ID
- `PUT /api/core/v1/realm/{tenantId}/users/{id}` - Atualizar usuário
- `DELETE /api/core/v1/realm/{tenantId}/users/{id}` - Remover usuário
