# Development Guidelines

## Code Quality Standards

### TypeScript Conventions
- **Strict typing**: Never use `any`, prefer specific types or `unknown`
- **Interface usage**: Use interfaces for complex objects, `type` for unions and primitives
- **Generic constraints**: Use `extends` for type safety (e.g., `TContext extends Context`)
- **Type inference**: Leverage TypeScript's type inference with proper schema definitions
- **Null safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)

### Import/Export Patterns
- **Named exports**: Always use `export const` instead of default exports
- **Zod imports**: Always use `import { z } from 'zod'` (never default import)
- **OpenAPI extension**: Always call `extendZodWithOpenApi(z)` after Zod import
- **Path aliases**: Use `@/` prefix for absolute imports from src directory
- **Re-export pattern**: Use `export * from` for version compatibility layers

### Documentation Standards
- **Portuguese comments**: Use Portuguese for code comments and documentation
- **JSDoc blocks**: Include comprehensive JSDoc for complex functions and classes
- **Inline explanations**: Document complex type casts and architectural decisions
- **Problem documentation**: Explain TypeScript limitations and workarounds in comments

## Architectural Patterns

### Domain-Driven Design Structure
- **Domain organization**: Group related functionality in `domains/{context}/{domain}/`
- **Version structure**: Maintain `latest/` and `v1/` directories within each domain
- **File naming**: Use `{domain}.{type}.ts` pattern (e.g., `account.service.ts`)
- **Separation of concerns**: Keep controllers, services, models, schemas, and routes separate

### Multi-tenant Architecture
- **Tenant-first parameters**: Always pass `tenantId` as first parameter in service functions
- **Database isolation**: Use tenant-specific database names via `getDBName(tenantId)`
- **UUID identifiers**: Use UUID strings for all document IDs, not ObjectId
- **Tenant validation**: Validate tenant context before any database operations

### Service Layer Patterns
- **Error handling**: Always throw specific error types (NotFoundError, ConflictError)
- **Logging integration**: Use structured logging with context information
- **Validation placement**: Perform business validations in services, not controllers
- **Return patterns**: Return objects directly or throw errors, never return null/undefined

## Technical Implementation Standards

### Database Modeling
- **Base schema inheritance**: Always extend `baseDocumentSchema` for common fields
- **UUID as String**: Use `{ type: String, default: uuidv4 }` for _id fields
- **Soft delete**: Implement soft delete with `deletedAt` field and custom methods
- **Index strategy**: Create unique indexes for business constraints
- **Pre-save hooks**: Use Mongoose middleware for automatic field updates

### Validation Strategy
- **Zod v4 syntax**: Use modern Zod v4 patterns (e.g., `z.email()` instead of `z.string().email()`)
- **Schema composition**: Build complex schemas from reusable base schemas
- **Error messages**: Provide clear, English error messages for validation failures
- **Request validation**: Validate all inputs at the API boundary using middleware

### Router Implementation
- **MagicRouter usage**: Always use MagicRouter instead of standard Koa Router
- **OpenAPI integration**: Define complete OpenAPI specs with request/response schemas
- **Path conversion**: Convert OpenAPI `{param}` syntax to Koa `:param` format
- **Middleware composition**: Build handler chains with validation, business logic, and response validation

### Error Handling Patterns
- **Custom error classes**: Use specific error types (NotFoundError, ConflictError, ValidationError)
- **Structured logging**: Log errors with context objects, not just error messages
- **Error propagation**: Let errors bubble up to centralized error handling middleware
- **User-friendly messages**: Provide clear error messages for API consumers

## Development Practices

### Testing Standards
- **Test organization**: Structure tests by domain and version (`tests/integration/domains/{context}/{domain}/v1/`)
- **File naming**: Use `{method}.{endpoint}.test.ts` pattern for integration tests
- **Setup patterns**: Use `beforeAll` for test setup, `getTenantId()` for tenant context
- **Assertion specificity**: Test specific properties, not just existence
- **Error scenarios**: Always test both success and failure cases

### Logging Practices
- **Structured logging**: Use Pino with structured data objects
- **Context awareness**: Include relevant IDs and context in log messages
- **Log levels**: Use appropriate levels (error, warn, info, debug)
- **Parameter order**: Place context object first, message string second in Pino calls

### Security Considerations
- **Input validation**: Validate all inputs using Zod schemas
- **Password handling**: Use bcrypt for password hashing with proper salt rounds
- **Database name validation**: Sanitize database names to prevent injection attacks
- **JWT implementation**: Use proper JWT signing and verification with tenant context

### Performance Optimization
- **Database queries**: Use efficient queries with proper indexing
- **Pagination**: Implement cursor-based or offset-based pagination for large datasets
- **Connection pooling**: Leverage Mongoose connection pooling for database efficiency
- **Async patterns**: Use async/await consistently, avoid callback patterns

## Code Organization Principles

### File Structure Consistency
- **Single responsibility**: Each file should have one clear purpose
- **Naming conventions**: Use descriptive, consistent naming across all files
- **Import organization**: Group imports logically (external, internal, relative)
- **Export consistency**: Use consistent export patterns within domain boundaries

### Dependency Management
- **Version pinning**: Use specific versions for critical dependencies
- **Peer dependencies**: Properly declare peer dependencies for shared libraries
- **Development tools**: Maintain consistent development tooling across the project
- **Security updates**: Regularly update dependencies for security patches

### Configuration Management
- **Environment variables**: Use dotenv for environment-specific configuration
- **Type safety**: Define typed configuration objects for environment variables
- **Default values**: Provide sensible defaults for optional configuration
- **Validation**: Validate configuration at application startup