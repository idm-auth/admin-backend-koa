# Product Overview - Backend-Koa IAM

## Project Purpose

Backend-Koa IAM is a comprehensive Identity and Access Management (IAM) system that combines the functionality of AWS IAM and AWS Cognito into a unified, self-hosted multi-tenant solution. It provides enterprise-grade authentication, authorization, and access control for SaaS applications and microservices architectures.

## Value Proposition

- **AWS Alternative**: Self-hosted replacement for AWS IAM + Cognito, eliminating vendor lock-in and reducing cloud costs
- **Multi-tenant Architecture**: Complete data isolation per tenant with separate databases and security contexts
- **Unified Solution**: Single system handling both authentication (Cognito-like) and authorization (IAM-like)
- **Developer-Friendly**: RESTful APIs with comprehensive OpenAPI/Swagger documentation
- **Enterprise-Ready**: Production-grade security, observability, and scalability

## Key Features and Capabilities

### Authentication (Cognito-like)
- User account creation and management with email-based identity
- JWT-based authentication with tenant-specific tokens
- Secure password handling with bcrypt hashing
- OWASP-compliant password policies
- Token generation and verification per tenant realm

### Authorization (IAM-like)
- Role-Based Access Control (RBAC) system
- Granular permission policies with resource-level control
- User groups for organizational hierarchy
- Flexible relationship models:
  - Account-to-Group associations
  - Account-to-Role assignments
  - Group-to-Role mappings
  - Account/Group/Role-to-Policy attachments

### Multi-tenancy
- Complete tenant isolation (realms) with separate MongoDB databases
- Tenant-scoped APIs: `/api/realm/{tenantId}/...`
- Security context per tenant for JWT secrets and configurations
- Database name sanitization for security

### Core Entities
- **Realms**: Multi-tenant contexts (equivalent to Cognito User Pools)
- **Accounts**: User identities with email and credentials
- **Groups**: Organizational units for grouping users
- **Roles**: Permission definitions for access control
- **Policies**: Granular access rules (resource, action, effect)
- **Applications**: Client application registrations
- **Application Registries**: Global application catalog

### API Capabilities
- Full CRUD operations for all entities
- Advanced search and filtering (e.g., search accounts by email)
- Pagination support for large datasets
- Relationship management (associations between entities)
- Bulk operations where applicable
- Interactive Swagger UI at `/docs`

## Target Users

### Developers
- Building SaaS applications requiring multi-tenant authentication
- Implementing microservices with centralized access control
- Creating APIs with granular permission systems
- Migrating from AWS Cognito/IAM to self-hosted solutions

### System Administrators
- Managing user accounts across multiple tenants
- Defining and enforcing security policies
- Auditing access and permissions
- Configuring tenant-specific authentication rules

### DevOps Engineers
- Deploying self-hosted IAM infrastructure
- Integrating with existing monitoring and observability tools
- Managing multi-tenant database architectures
- Scaling authentication services

## Use Cases

### SaaS Multi-tenant Applications
- Isolate customer data with separate realms
- Provide per-customer user management
- Enforce tenant-specific access policies
- Scale authentication across thousands of tenants

### Microservices Authentication
- Centralized authentication service for distributed systems
- JWT token validation across services
- Service-to-service authorization
- API gateway integration

### Enterprise Access Control
- Hierarchical permission management with groups and roles
- Fine-grained resource access policies
- Compliance with security standards (OWASP)
- Audit trails for access patterns

### API Security
- Protect REST APIs with JWT authentication
- Implement role-based endpoint access
- Validate permissions at the resource level
- Rate limiting and security monitoring

## Business Benefits

- **Cost Reduction**: Eliminate AWS Cognito and IAM service fees
- **Data Sovereignty**: Full control over user data and infrastructure
- **Customization**: Extend and modify to meet specific requirements
- **Vendor Independence**: No lock-in to cloud provider services
- **Compliance**: Meet data residency and privacy regulations
- **Scalability**: Horizontal scaling with MongoDB sharding
