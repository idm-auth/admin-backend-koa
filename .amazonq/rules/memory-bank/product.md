# Product Overview

## Project Purpose
Backend-Koa is a multi-tenant Identity and Access Management (IAM) system built with Node.js and Koa.js. It provides comprehensive user authentication, authorization, and role-based access control (RBAC) capabilities for enterprise applications.

## Value Proposition
- **Multi-tenant Architecture**: Isolated data and configurations per tenant/realm
- **Enterprise-grade Security**: OWASP-compliant password policies, JWT authentication, bcrypt hashing
- **Flexible RBAC**: Granular permissions through accounts, groups, roles, and policies
- **API-first Design**: RESTful APIs with comprehensive OpenAPI/Swagger documentation
- **Developer Experience**: Type-safe development with TypeScript, Zod validation, comprehensive testing

## Key Features

### Authentication & Authorization
- JWT-based authentication with tenant-specific tokens
- Password management with OWASP security standards
- Role-based access control (RBAC) system
- Multi-tenant data isolation

### User Management
- Account creation and management
- Group-based organization
- Role assignment and inheritance
- Policy-based permissions

### API Capabilities
- RESTful endpoints for all resources
- Comprehensive CRUD operations
- Search and filtering capabilities
- Tenant-scoped operations

### Developer Features
- Type-safe API with TypeScript and Zod
- Comprehensive test coverage (unit and integration)
- Auto-generated API documentation
- Docker development environment

## Target Users

### Primary Users
- **Enterprise Developers**: Building multi-tenant applications requiring IAM
- **System Administrators**: Managing user access and permissions
- **DevOps Teams**: Deploying secure, scalable authentication systems

### Use Cases
- Multi-tenant SaaS applications
- Enterprise identity management
- Microservices authentication
- API access control
- User permission management

## Core Domains
- **Realms**: Multi-tenant context management
- **Accounts**: User identity and authentication
- **Groups**: User organization and management
- **Roles**: Permission definitions
- **Policies**: Fine-grained access control
- **Relationships**: Account-Group, Account-Role, Group-Role associations