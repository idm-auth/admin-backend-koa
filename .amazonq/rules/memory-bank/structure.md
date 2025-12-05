# Project Structure - Backend-Koa IAM

## Directory Organization

### Root Structure
```
/workspace/
├── .amazonq/rules/          # AI development rules and guidelines
├── .devcontainer/           # Docker development environment
├── .docs/                   # Project documentation
├── .external/               # External dependencies (auth-client-js)
├── scripts/                 # Build and utility scripts
├── src/                     # Application source code
├── tests/                   # Test suites (unit + integration)
└── [config files]           # package.json, tsconfig.json, etc.
```

## Source Code Structure (`src/`)

### Domain-Driven Design (DDD) Architecture
```
src/
├── domains/                 # Business domains (DDD)
│   ├── commons/            # Shared components
│   ├── config/             # Configuration domain
│   ├── core/               # Core system domains
│   ├── realms/             # Multi-tenant IAM domains
│   ├── swagger/            # API documentation
│   └── api.routes.ts       # Root API router
├── errors/                 # Custom error classes
├── middlewares/            # Koa middleware
├── plugins/                # Infrastructure plugins
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── index.ts                # Application entry point
```

### Domain Structure Pattern
Each domain follows a consistent structure:
```
domain-name/
├── {entity}.controller.ts  # HTTP request handlers
├── {entity}.service.ts     # Business logic
├── {entity}.model.ts       # MongoDB schema
├── {entity}.schema.ts      # Zod validation schemas
├── {entity}.mapper.ts      # Data transformation
└── {entity}.routes.ts      # Route definitions
```

## Core Components

### Commons Domain (`src/domains/commons/`)
Shared components used across all domains:
- **base/**: Base schemas (email, password, UUID, pagination)
- **idm-client/**: Internal client service
- **validations/**: Validation utilities

### Config Domain (`src/domains/config/`)
System configuration management:
- Base configuration models
- Web admin configuration
- Configuration API endpoints

### Core Domain (`src/domains/core/`)
Core system functionality:
- **realms/**: Tenant management (realm CRUD)
- **application-registries/**: Global application catalog

### Realms Domain (`src/domains/realms/`)
Multi-tenant IAM functionality:
- **accounts/**: User identity management
- **groups/**: User organization
- **roles/**: Permission definitions
- **policies/**: Access control rules
- **applications/**: Tenant-specific applications
- **authentication/**: Login and JWT operations
- **account-groups/**: Account-Group associations
- **account-roles/**: Account-Role assignments
- **account-policies/**: Account-Policy attachments
- **group-roles/**: Group-Role mappings
- **group-policies/**: Group-Policy attachments
- **role-policies/**: Role-Policy attachments
- **jwt/**: JWT token services

### Infrastructure Components

#### Errors (`src/errors/`)
Custom error classes for HTTP responses:
- `ConflictError` (409)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `UnauthorizedError` (401)
- `ValidationError` (400)

#### Middlewares (`src/middlewares/`)
Koa middleware for cross-cutting concerns:
- `authentication.middleware.ts`: JWT verification
- `authorization.middleware.ts`: Permission checking
- `errorHandler.middleware.ts`: Global error handling
- `requestId.middleware.ts`: Request tracking
- `validation.middleware.ts`: Zod schema validation

#### Plugins (`src/plugins/`)
Infrastructure and third-party integrations:
- `asyncLocalStorage.plugin.ts`: Request context storage
- `dotenv.plugin.ts`: Environment configuration
- `koaServer.plugin.ts`: Koa server setup
- `mongo.plugin.ts`: MongoDB connection
- `pino.plugin.ts`: Structured logging
- `swagger.plugin.ts`: OpenAPI documentation
- `telemetry.plugin.ts`: OpenTelemetry tracing

#### Utils (`src/utils/`)
Utility functions and helpers:
- **core/**: Core utilities
- **http/**: HTTP-related utilities
- `crudSwagger.util.ts`: Swagger CRUD templates
- `localStorage.util.ts`: Context storage access
- `pagination.util.ts`: Pagination helpers
- `routeLogger.util.ts`: Route logging
- `tracing.util.ts`: Telemetry wrappers

## Test Structure (`tests/`)

### Test Organization
```
tests/
├── integration/            # Integration tests
│   ├── domains/           # Domain-specific integration tests
│   └── routes/            # Route-level tests
├── unit/                  # Unit tests
│   ├── domains/           # Domain-specific unit tests
│   ├── errors/            # Error class tests
│   ├── middlewares/       # Middleware tests
│   ├── plugins/           # Plugin tests
│   ├── schemas/           # Schema validation tests
│   ├── services/          # Service tests
│   └── utils/             # Utility tests
├── labs/                  # Experimental tests
├── setup/                 # Test configuration
│   ├── base.setup.ts
│   ├── globalSetup.ts
│   ├── globalTeardown.ts
│   └── integration.setup.ts
├── types/                 # Test type definitions
└── utils/                 # Test utilities
    ├── auth.util.ts
    ├── mapper-test-helpers.ts
    ├── tenant.util.ts
    └── test-constants.ts
```

### Test Naming Conventions
- **Unit tests**: `tests/unit/domains/{context}/{domain}/{layer}/{function}.test.ts`
- **Integration tests**: `tests/integration/domains/{context}/{domain}/{method}.{endpoint}.test.ts`

## Architectural Patterns

### Domain-Driven Design (DDD)
- Organized by business domains (realms, core, commons)
- Clear separation of concerns (controller, service, model, schema, mapper)
- Domain-specific routes and logic

### Multi-tenant Architecture
- Tenant isolation via separate MongoDB databases
- Tenant-scoped API routes: `/api/realm/{tenantId}/...`
- Tenant context in JWT tokens

### Layered Architecture
1. **Routes**: Define HTTP endpoints and OpenAPI specs
2. **Controllers**: Handle HTTP requests/responses
3. **Services**: Implement business logic
4. **Models**: Define data structures and database schemas
5. **Schemas**: Validate input/output with Zod
6. **Mappers**: Transform data between layers

### Middleware Pipeline
Request flow: `requestId → authentication → authorization → validation → controller → service → model`

## Configuration Files

- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript configuration with path aliases (`@/`, `@test/`)
- **vitest.config.mjs**: Test runner configuration
- **eslint.config.mjs**: Linting rules
- **prettier.config.mjs**: Code formatting
- **rollup.config.mjs**: Build configuration
- **nodemon.json**: Development server config
- **knip.json**: Unused code detection

## Development Environment

### DevContainer (`.devcontainer/`)
- Docker-based development environment
- MongoDB container for local development
- VSCode configuration and extensions
- Automated setup scripts

### External Dependencies (`.external/`)
- `auth-client-js`: Internal authentication client library
- Linked as local npm package

## API Structure

### Route Hierarchy
```
/api
├── /config                 # System configuration
├── /core                   # Core functionality
│   ├── /realms            # Realm management
│   └── /application-registries
└── /realm/{tenantId}      # Tenant-scoped APIs
    ├── /accounts
    ├── /groups
    ├── /roles
    ├── /policies
    ├── /applications
    ├── /authentication
    ├── /account-groups
    ├── /account-roles
    ├── /account-policies
    ├── /group-roles
    ├── /group-policies
    └── /role-policies
```

### URL Pattern
- **Global**: `/api/{context}/{domain}`
- **Tenant-scoped**: `/api/realm/{tenantId}/{domain}`

## Key Relationships

### Component Dependencies
- Controllers depend on Services
- Services depend on Models
- All layers use Schemas for validation
- Mappers transform between layers
- Middlewares wrap Controllers
- Plugins provide infrastructure

### Data Flow
1. HTTP Request → Routes
2. Routes → Middlewares (auth, validation)
3. Middlewares → Controllers
4. Controllers → Services
5. Services → Models (MongoDB)
6. Models → Services
7. Services → Mappers
8. Mappers → Controllers
9. Controllers → HTTP Response
