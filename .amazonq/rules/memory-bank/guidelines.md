# Development Guidelines - Backend-Koa IAM

## Code Quality Standards

### Import Organization
- **Absolute imports**: Always use `@/` prefix for src imports, `@test/` for test imports
- **Import grouping**: External libraries first, then internal modules grouped by domain
- **Named imports**: Prefer named imports over default imports for better tree-shaking
- **Namespace imports**: Use `* as serviceName` pattern for service imports

### Function and Variable Naming
- **Service constants**: Use `SERVICE_NAME = 'domain.service'` pattern for telemetry
- **Function naming**: Use descriptive verbs (create, findById, update, remove, findAllPaginated)
- **Parameter naming**: Use `tenantId` as first parameter, followed by `id`, then `data`
- **Boolean variables**: Use `is`, `has`, `can` prefixes for clarity

### Error Handling Patterns
- **Service layer**: Always throw specific errors (NotFoundError, ValidationError, ConflictError)
- **Never return null**: Services return objects directly or throw errors
- **Error context**: Include relevant context in error messages and logging
- **Consistent messaging**: Use standardized error messages across similar operations

### Logging Standards
- **Structured logging**: Use object-first pattern `logger.info({ data }, 'message')`
- **Context inclusion**: Always include tenantId, accountId, and operation context
- **Log levels**: info for operations, debug for detailed data, warn for recoverable issues, error for failures
- **Security**: Never log sensitive data like passwords or tokens

## Architectural Patterns

### Multi-tenant Design
- **Tenant isolation**: All operations require tenantId as first parameter
- **Database scoping**: Use `getDBName({ publicUUID: tenantId })` for tenant-specific databases
- **Context propagation**: Tenant context flows through all layers (controller → service → model)
- **Security boundaries**: Validate tenant access at service layer

### Service Layer Patterns
- **Parameter order**: `tenantId, id?, data?` - tenant always first, ID second, data last
- **Return patterns**: Return entity objects directly, never null or undefined
- **Validation**: Validate inputs using Zod schemas before processing
- **Business logic**: All business rules implemented in service layer, not controllers

### Database Interaction
- **Model access**: Use `getModel(dbName)` pattern for tenant-specific collections
- **UUID handling**: Use string-based UUIDs for _id fields, not ObjectId
- **Query patterns**: Use MongoDB query operators with proper indexing
- **Error handling**: Handle MongoDB duplicate key errors (code 11000) gracefully

### Telemetry Integration
- **Span wrapping**: Use `withSpanAsync` for all service functions
- **Attribute setting**: Include operation, tenant.id, entity.id attributes
- **Span naming**: Follow `{service}.{operation}` pattern
- **Context propagation**: Pass span context through async operations

## API Design Patterns

### MagicRouter Usage
- **Route configuration**: Include name, path, summary, handlers, request/response schemas
- **Validation**: Use Zod schemas for params, query, body validation
- **Middleware**: Apply validation middleware automatically through MagicRouter
- **Documentation**: Generate OpenAPI specs automatically from route configs

### Controller Patterns
- **Data access**: Use `ctx.validated` for accessing validated request data
- **Service calls**: Controllers only orchestrate service calls, no business logic
- **Response handling**: Return data directly, let middleware handle response formatting
- **Error propagation**: Let service errors bubble up to error middleware

### Request/Response Handling
- **Validation**: All inputs validated using Zod schemas before processing
- **Type safety**: Use TypeScript interfaces derived from Zod schemas
- **Consistent responses**: Standardized response format across all endpoints
- **Error responses**: Consistent error structure with proper HTTP status codes

## Security Practices

### Input Validation
- **Zod schemas**: Use Zod v4 for all input validation with proper error messages
- **Sanitization**: Sanitize database names and user inputs to prevent injection
- **Type checking**: Strict TypeScript configuration with zero tolerance for `any`
- **Pattern validation**: Use regex patterns for format validation (email, UUID, etc.)

### Authentication and Authorization
- **JWT tokens**: Use tenant-scoped JWT tokens with proper expiration
- **Password handling**: Use bcrypt for password hashing with proper salt rounds
- **Session management**: Stateless authentication using JWT tokens
- **Access control**: Implement tenant-based access control at service layer

### Data Protection
- **Tenant isolation**: Complete data separation between tenants
- **Sensitive data**: Never log or expose sensitive information
- **Database security**: Use connection pooling and proper connection management
- **Environment variables**: Secure configuration management with proper defaults

## Testing Standards

### Test Organization
- **File structure**: One test file per function following domain structure
- **Test types**: Integration tests preferred, unit tests for specific edge cases
- **Coverage**: 100% code coverage requirement with no exceptions
- **Naming**: Descriptive test names indicating scenario and expected outcome

### Test Data Management
- **Test utilities**: Use `createTestEmail()`, `TEST_PASSWORD`, `uuidv4()` for test data
- **Tenant isolation**: Use `getTenantId('unique-name')` for test tenant contexts
- **Database**: Use MongoDB in-memory server for isolated test environments
- **Cleanup**: Proper test cleanup and resource management

### Mock Usage Guidelines
- **Real implementation first**: Always try real implementation before mocking
- **Supervision required**: AI must request permission before creating/modifying mocks
- **Naming convention**: Use "Mock" suffix only for actual mock objects
- **Minimal mocking**: Mock only external dependencies, not internal business logic

## Performance Considerations

### Database Optimization
- **Indexing**: Proper indexes on frequently queried fields
- **Pagination**: Use efficient pagination with proper sorting
- **Connection pooling**: Mongoose connection pooling for database efficiency
- **Query optimization**: Use aggregation pipelines for complex queries

### Memory Management
- **Resource cleanup**: Proper cleanup of database connections and resources
- **Async patterns**: Use async/await consistently for non-blocking operations
- **Error boundaries**: Proper error handling to prevent memory leaks
- **Monitoring**: Use telemetry for performance monitoring and optimization

## Code Documentation

### Inline Documentation
- **Complex logic**: Document complex business logic and algorithms
- **Type annotations**: Use TypeScript types for self-documenting code
- **API documentation**: Generate OpenAPI docs automatically from code
- **Security notes**: Document security considerations and NOSONAR comments

### Code Comments
- **Why not what**: Explain reasoning behind implementation decisions
- **Security notes**: Document security-related code with NOSONAR explanations
- **TODO items**: Use structured TODO comments for future improvements
- **Type casting**: Explain necessary type casts with detailed comments

## Development Workflow

### Code Quality Checks
- **Type checking**: Run `npm run type-check` with zero errors tolerance
- **Linting**: Use ESLint with automatic fixing for consistent code style
- **Testing**: Comprehensive test suite with coverage reporting
- **Build verification**: Ensure clean builds before committing

### Environment Management
- **Development**: Use Docker containers for consistent development environment
- **Configuration**: Environment-specific configuration with secure defaults
- **Dependencies**: Keep dependencies updated and security-scanned
- **DevContainer**: Use VS Code DevContainer for standardized development setup