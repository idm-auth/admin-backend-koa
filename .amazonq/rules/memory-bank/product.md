# Product Overview

## Project Purpose

Backend-Koa IAM is a comprehensive Identity and Access Management (IAM) system that combines the functionality of AWS IAM and AWS Cognito into a unified multi-tenant solution. It provides enterprise-grade authentication, authorization, and access control for modern applications.

## Value Proposition

- **Unified IAM Solution**: Combines user authentication (Cognito-like) with permission management (IAM-like) in a single system
- **Multi-Tenant Architecture**: Complete data isolation per tenant/realm with separate database contexts
- **Production-Ready**: Built with enterprise patterns including DDD architecture, comprehensive testing, and observability
- **Developer-Friendly**: RESTful APIs with OpenAPI/Swagger documentation, type-safe validation, and clear error handling

## Key Features

### Authentication & User Management
- User account creation and management (CRUD operations)
- JWT-based authentication with tenant-scoped tokens
- OWASP-compliant password policies with bcrypt hashing
- Email-based user identification with RFC 5322 validation
- Secure credential management with test credential annotations

### Authorization & Access Control
- Role-Based Access Control (RBAC) system
- Granular permission policies (IAM-style)
- User groups for organizational hierarchy
- Flexible relationship management:
  - Account-to-Group associations
  - Account-to-Role assignments
  - Group-to-Role mappings

### Multi-Tenancy
- Realm-based tenant isolation (equivalent to Cognito User Pools)
- Separate MongoDB databases per tenant
- Tenant-scoped API operations
- Secure tenant context propagation via AsyncLocalStorage

### API & Integration
- RESTful API design with consistent patterns
- Comprehensive OpenAPI 3.0 documentation via Swagger
- MagicRouter for type-safe routing with automatic validation
- Structured error responses with proper HTTP status codes
- Request/response validation using Zod v4 schemas

### Observability & Monitoring
- Distributed tracing with OpenTelemetry
- Structured logging with Pino
- Request ID tracking across service boundaries
- Telemetry integration in controllers, services, and mappers
- Jaeger and Prometheus exporters for metrics

### Data Management
- MongoDB with Mongoose ODM
- UUID-based entity identification
- Efficient pagination for large datasets
- Optimized indexes for multi-tenant queries
- Database name sanitization for security

## Target Users

### Application Developers
- Building SaaS applications requiring multi-tenant authentication
- Implementing microservices with centralized access control
- Creating APIs with granular permission requirements
- Developing applications needing AWS IAM/Cognito alternatives

### System Administrators
- Managing user accounts across multiple tenants
- Defining and enforcing security policies
- Organizing users into groups and roles
- Auditing access patterns and permissions

### DevOps Engineers
- Deploying containerized IAM solutions
- Integrating authentication into CI/CD pipelines
- Monitoring system health and performance
- Managing multi-environment configurations

## Use Cases

### SaaS Platform Authentication
Multi-tenant SaaS applications can use realms to isolate customer data while providing each tenant with complete user management, role definitions, and permission policies.

### Microservices Authorization
Microservices architectures can leverage the centralized IAM for consistent authentication and authorization across all services, with JWT tokens carrying tenant and permission context.

### Enterprise Access Management
Organizations can implement fine-grained access control with groups representing departments, roles defining job functions, and policies controlling resource access.

### API Gateway Integration
API gateways can validate JWT tokens and enforce permissions before routing requests to backend services, using the IAM as the source of truth for access decisions.

### Development & Testing
The system includes comprehensive test utilities, in-memory MongoDB support, and test credential management for safe development and automated testing workflows.
