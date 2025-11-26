# Project Structure

## Directory Organization

### Root Structure
```
/workspace/
├── .amazonq/          # AI assistant rules and memory bank
├── .devcontainer/     # Development container configuration
├── .docs/             # Project documentation
├── .mongodata/        # MongoDB data directory (local development)
├── scripts/           # Utility scripts for testing and coverage
├── src/               # Application source code
├── tests/             # Test suites (unit, integration, labs)
└── [config files]     # TypeScript, ESLint, Prettier, Vitest configs
```

## Source Code Structure (`src/`)

### Domain-Driven Design Architecture
```
src/
├── domains/           # Business domains (DDD structure)
│   ├── commons/       # Shared components across domains
│   ├── config/        # Configuration domain
│   ├── core/          # Core functionality
│   ├── realms/        # Multi-tenant management domain
│   ├── swagger/       # API documentation domain
│   └── api.routes.ts  # Root API router composition
├── errors/            # Custom error classes
├── middlewares/       # Koa middleware functions
├── plugins/           # Infrastructure plugins
├── utils/             # Utility functions and helpers
└── index.ts           # Application entry point
```

### Domain Structure Pattern
Each domain follows a consistent flat structure:
```
domains/{context}/{domain}/
├── {domain}.controller.ts    # HTTP request handlers
├── {domain}.service.ts       # Business logic layer
├── {domain}.model.ts         # MongoDB schema and types
├── {domain}.schema.ts        # Zod validation schemas
├── {domain}.mapper.ts        # Data transformation layer
└── {domain}.routes.ts        # MagicRouter route definitions
```

### Key Domains

#### `realms/` - Multi-Tenant Management
- **accounts/**: User account management (authentication)
- **groups/**: User group organization
- **roles/**: Role definitions for RBAC
- **policies/**: Permission policies (IAM-style)
- **account-groups/**: Account-to-Group associations
- **account-roles/**: Account-to-Role assignments
- **group-roles/**: Group-to-Role mappings

#### `core/` - Core Functionality
- **realm/**: Tenant/realm management and context

#### `commons/` - Shared Components
- **base/**: Base schemas and utilities
- **validations/**: Common validation patterns

## Test Structure (`tests/`)

### Test Organization
```
tests/
├── integration/       # Integration tests (API endpoints)
│   ├── domains/       # Domain-specific integration tests
│   └── routes/        # Route-level integration tests
├── unit/              # Unit tests (isolated functions)
│   ├── domains/       # Domain layer unit tests
│   ├── middlewares/   # Middleware unit tests
│   ├── plugins/       # Plugin unit tests
│   ├── schemas/       # Schema validation tests
│   ├── services/      # Service layer tests
│   └── utils/         # Utility function tests
├── labs/              # Experimental and simulation tests
├── setup/             # Test configuration and setup
├── types/             # TypeScript type definitions for tests
└── utils/             # Test utilities and helpers
```

### Test File Naming Conventions
- **Unit tests**: `{functionName}.test.ts` (one file per function)
- **Integration tests**: `{method}.{endpoint}.test.ts` (e.g., `post.accounts.test.ts`)

## Infrastructure Components

### Plugins (`src/plugins/`)
- **asyncLocalStorage.plugin.ts**: Request context management
- **dotenv.plugin.ts**: Environment variable loading
- **koaServer.plugin.ts**: Koa application setup
- **mongo.plugin.ts**: MongoDB connection management
- **pino.plugin.ts**: Structured logging configuration
- **swagger.plugin.ts**: OpenAPI documentation generation
- **telemetry.plugin.ts**: OpenTelemetry tracing setup

### Middlewares (`src/middlewares/`)
- **errorHandler.middleware.ts**: Global error handling
- **requestId.middleware.ts**: Request ID generation and tracking
- **validation.middleware.ts**: Zod schema validation

### Utilities (`src/utils/`)
- **core/**: Core utility functions
- **crudSwagger.util.ts**: CRUD operation Swagger helpers
- **localStorage.util.ts**: AsyncLocalStorage context access
- **pagination.util.ts**: Pagination helpers
- **routeLogger.util.ts**: Route logging utilities
- **tracing.util.ts**: OpenTelemetry tracing wrappers

## Configuration Files

### Development Environment
- **.devcontainer/**: VS Code dev container with MongoDB
- **docker-compose.yml**: Local development services
- **nodemon.json**: Development server auto-reload

### Build & Quality
- **tsconfig.json**: TypeScript configuration with path aliases
- **eslint.config.mjs**: ESLint rules and plugins
- **prettier.config.mjs**: Code formatting rules
- **vitest.config.mjs**: Test runner configuration

### Environment
- **.env**: Base environment variables
- **.env.development.local**: Local development overrides
- **.env.test**: Test environment configuration

## Architectural Patterns

### Layered Architecture
1. **Routes Layer**: MagicRouter definitions with OpenAPI specs
2. **Controller Layer**: HTTP request/response handling
3. **Service Layer**: Business logic and orchestration
4. **Model Layer**: Data persistence and schemas
5. **Mapper Layer**: Data transformation between layers

### Separation of Concerns
- **Controllers**: Extract validated data from `ctx.validated`, call services
- **Services**: Implement business logic, throw domain errors
- **Models**: Define data structure and database operations
- **Schemas**: Validate input/output with Zod
- **Mappers**: Transform between internal and external representations

### Multi-Tenant Pattern
- **Tenant ID**: Always first parameter in service functions
- **Database Isolation**: Separate MongoDB database per tenant
- **Context Propagation**: AsyncLocalStorage for request-scoped tenant context

### Error Handling
- **Custom Errors**: Domain-specific error classes (NotFoundError, ConflictError, etc.)
- **Service Layer**: Throws errors, never returns null
- **Controller Layer**: Catches errors via global error handler
- **HTTP Mapping**: Automatic status code mapping in error middleware

### Type Safety
- **Zod v4**: Runtime validation with TypeScript type inference
- **Schema-First**: Types derived from Zod schemas
- **No `any`**: Strict TypeScript with zero tolerance for `any` types
- **Type Checking**: `npm run type-check` enforces zero errors

### Testing Strategy
- **Integration First**: Prioritize integration tests for API endpoints
- **Unit Tests**: Only for gaps not covered by integration tests
- **100% Coverage**: Zero tolerance for incomplete coverage
- **Real Implementations**: Avoid mocks unless absolutely necessary
