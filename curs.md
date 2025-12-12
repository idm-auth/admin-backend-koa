# Criar conta

curl -X POST http://localhost:3000/accounts/:tenantId \
 -H "Content-Type: application/json" \
 -d '{"email":"user@example.com","password":"password123"}'

# Listar contas (paginado)

curl -X GET "http://localhost:3000/accounts/:tenantId?page=1&limit=25"

# Buscar conta por ID

curl -X GET http://localhost:3000/accounts/:tenantId/:id

# Atualizar conta

curl -X PUT http://localhost:3000/accounts/:tenantId/:id \
 -H "Content-Type: application/json" \
 -d '{"email":"newemail@example.com"}'

# Deletar conta

curl -X DELETE http://localhost:3000/accounts/:tenantId/:id

# Resetar senha

curl -X PATCH http://localhost:3000/accounts/:tenantId/:id/reset-password \
 -H "Content-Type: application/json" \
 -d '{"password":"newpassword123"}'

# Atualizar senha

curl -X PATCH http://localhost:3000/accounts/:tenantId/:id/update-password \
 -H "Content-Type: application/json" \
 -d '{"currentPassword":"oldpass","newPassword":"newpass"}'

# Adicionar email

curl -X POST http://localhost:3000/accounts/:tenantId/:id/email \
 -H "Content-Type: application/json" \
 -d '{"email":"second@example.com"}'

# Remover email

curl -X POST http://localhost:3000/accounts/:tenantId/:id/email/remove \
 -H "Content-Type: application/json" \
 -d '{"email":"second@example.com"}'

# Definir email primário

curl -X PATCH http://localhost:3000/accounts/:tenantId/:id/email/primary \
 -H "Content-Type: application/json" \
 -d '{"email":"primary@example.com"}'

# Definir status ativo

curl -X PATCH http://localhost:3000/accounts/:tenantId/:id/active-status \
 -H "Content-Type: application/json" \
 -d '{"isActive":true}'
