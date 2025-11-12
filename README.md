# Backend-Koa IAM

> **CRÍTICO PARA IA**: [Regra IA-no-use-mock](.amazonq/rules/IA-no-use-mock.md) - IA PRECISA SUPERVISÃO TOTAL PARA MOCKS

Sistema de Identity and Access Management (IAM) multi-tenant que combina funcionalidades do **AWS IAM** e **AWS Cognito** em uma solução unificada.

## Visão Geral

Este projeto oferece uma alternativa completa aos serviços AWS IAM e Cognito, fornecendo:

- **Gerenciamento de Permissões** (similar ao AWS IAM)
- **Autenticação e Autorização** (similar ao AWS Cognito)
- **Arquitetura Multi-tenant** para isolamento de dados
- **APIs RESTful** com documentação OpenAPI/Swagger

## Funcionalidades Principais

### Autenticação (Cognito-like)
- Criação e gerenciamento de contas de usuário
- Autenticação JWT com tokens tenant-específicos
- Políticas de senha compatíveis com OWASP
- Hash de senhas com bcrypt

### Autorização (IAM-like)
- Sistema RBAC (Role-Based Access Control)
- Políticas granulares de permissão
- Grupos de usuários para organização
- Relacionamentos Account-Group, Account-Role, Group-Role

### Multi-tenancy
- Isolamento completo de dados por tenant/realm
- Bancos de dados separados por tenant
- Contexto de segurança por tenant
- APIs com escopo de tenant

## Recursos do Sistema

### Entidades Principais
- **Realms**: Contextos multi-tenant (equivalente aos User Pools do Cognito)
- **Accounts**: Identidades de usuário (equivalente aos Users do Cognito)
- **Groups**: Organização de usuários
- **Roles**: Definições de permissões (equivalente às IAM Roles)
- **Policies**: Controle de acesso granular (equivalente às IAM Policies)

### APIs Disponíveis
- Gerenciamento completo de contas (CRUD)
- Operações de grupos e roles
- Associações Account-Group e Account-Role
- Busca e paginação em todos os recursos
- Documentação automática via Swagger

## Stack Tecnológica

- **Runtime**: Node.js + TypeScript
- **Framework**: Koa.js
- **Banco de Dados**: MongoDB + Mongoose
- **Validação**: Zod v4 com OpenAPI
- **Autenticação**: JWT + bcrypt
- **Testes**: Vitest + Supertest
- **Documentação**: Swagger/OpenAPI

## Arquitetura

### Domain-Driven Design (DDD)
```
src/domains/
├── realms/     # Multi-tenant management
├── core/       # Core functionality
└── commons/    # Shared components
```

### Arquitetura Simplificada
- Implementação direta na raiz do domínio
- APIs diretas: `/api/{context}/{domain}`

## Início Rápido

### Pré-requisitos
- Docker e Docker Compose
- Node.js 22+

### Desenvolvimento
```bash
# Clone o repositório
git clone https://github.com/idm-auth/backend-koa.git

# Inicie o ambiente de desenvolvimento
docker-compose up -d

# Instale dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Execute testes
npm run test
```

### Documentação da API
Acesse `http://localhost:3000/docs` para a documentação Swagger interativa.

## Exemplos de Uso

### Criar uma Conta
```bash
curl -X POST http://localhost:3000/api/realm/{tenantId}/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Buscar Conta por Email
```bash
curl -X GET "http://localhost:3000/api/realm/{tenantId}/accounts/search?email=user@example.com"
```

## Casos de Uso

### Para Desenvolvedores
- Aplicações SaaS multi-tenant
- Sistemas de autenticação para microserviços
- Controle de acesso granular em APIs

### Para Administradores
- Gerenciamento centralizado de usuários
- Definição de políticas de segurança
- Auditoria de acessos e permissões

## Segurança

- Validação rigorosa de entrada com Zod
- Isolamento de dados por tenant
- Tokens JWT com contexto de tenant
- Políticas de senha OWASP
- Sanitização de nomes de banco de dados

## Performance

- Conexão pooling com Mongoose
- Paginação eficiente para grandes datasets
- Índices otimizados para queries multi-tenant
- Logging estruturado com Pino

## Testes

```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:int

# Cobertura de código
npm run test:coverage
```

## Documentação

- [API Documentation](./API.md)
- [Docker Setup](./.docs/docker/)
- [DDD Migration Guide](./.docs/ddd-migration-accounts.md)

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

ISC License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Backend-Koa IAM** - Uma solução completa de Identity and Access Management inspirada nos melhores serviços da AWS.