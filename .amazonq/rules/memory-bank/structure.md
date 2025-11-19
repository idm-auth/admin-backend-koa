# Project Structure - Backend-Koa IAM

## Directory Organization

### Root Structure
```
/workspace/
├── src/                    # Source code
├── tests/                  # Test suites
├── .devcontainer/         # Development environment
├── .docs/                 # Documentation
├── scripts/               # Build and utility scripts
├── coverage/              # Test coverage reports
└── .amazonq/              # AI assistant rules and memory
```

## Source Code Architecture (`src/`)

### Domain-Driven Design (DDD) Structure
```
src/domains/
├── commons/               # Shared components
├── config/                # Configuration management
├── core/                  # Core system functionality
├── realms/                # Multi-tenant realm management
└── swagger/               # API documentation
```

### Core Components (`src/`)
```
src/
├── errors/                # Custom error classes
├── middlewares/           # Koa middleware functions
├── plugins/               # System plugins and integrations
├── utils/                 # Utility functions and helpers
└── index.ts              # Application entry point
```

## Domain Structure Patterns

### Standard Domain Layout
Each domain follows a consistent structure:
```
domain-name/
├── {entity}.controller.ts  # HTTP request handling
├── {entity}.service.ts     # Business logic
├── {entity}.model.ts       # Database schema
├── {entity}.schema.ts      # Validation schemas
├── {entity}.mapper.ts      # Data transformation
└── {entity}.routes.ts      # Route definitions
```

### Multi-tenant Realms Domain (`src/domains/realms/`)
```
realms/
├── accounts/              # User account management
├── groups/                # User group organization
├── roles/                 # Permission role definitions
├── policies/              # Access control policies
├── account-groups/        # Account-Group relationships
├── account-roles/         # Account-Role relationships
├── group-roles/           # Group-Role relationships
├── authentication/        # Login and JWT handling
├── jwt/                   # JWT token services
└── realms.routes.ts       # Realm routing aggregation
```

### Commons Domain (`src/domains/commons/`)
```
commons/
├── base/                  # Base classes and schemas
│   ├── base.model.ts      # Common database fields
│   ├── base.schema.ts     # Shared validation schemas
│   ├── base.service.ts    # Common service patterns
│   ├── pagination.schema.ts # Pagination validation
│   ├── request.schema.ts  # Request validation
│   └── webAdminConfig.schema.ts # Admin configuration
└── validations/           # Shared validation services
```

### Core Domain (`src/domains/core/`)
```
core/
├── realms/                # Realm management (tenant contexts)
└── core.routes.ts         # Core routing aggregation
```

## Infrastructure Components

### Plugins (`src/plugins/`)
```
plugins/
├── asyncLocalStorage.plugin.ts  # Request context storage
├── dotenv.plugin.ts            # Environment configuration
├── koaServer.plugin.ts         # Koa server setup
├── mongo.plugin.ts             # MongoDB connection
├── pino.plugin.ts              # Logging configuration
├── swagger.plugin.ts           # API documentation
└── telemetry.plugin.ts         # Observability and tracing
```

### Middlewares (`src/middlewares/`)
```
middlewares/
├── errorHandler.middleware.ts   # Global error handling
├── requestId.middleware.ts      # Request ID generation
└── validation.middleware.ts     # Input validation
```

### Utilities (`src/utils/`)
```
utils/
├── core/
│   └── MagicRouter.ts          # Enhanced routing system
├── crudSwagger.util.ts         # CRUD API documentation
├── localStorage.util.ts        # Context storage utilities
├── pagination.util.ts          # Pagination helpers
├── routeLogger.util.ts         # Route logging
├── routeLoggerDetailed.util.ts # Detailed route logging
└── tracing.util.ts            # Distributed tracing
```

## Test Architecture (`tests/`)

### Test Organization
```
tests/
├── integration/           # End-to-end API tests
│   ├── domains/          # Domain-specific integration tests
│   └── routes/           # Route-level integration tests
├── unit/                 # Isolated unit tests
│   ├── domains/          # Domain unit tests
│   ├── middlewares/      # Middleware unit tests
│   ├── plugins/          # Plugin unit tests
│   └── schemas/          # Schema validation tests
├── setup/                # Test configuration
├── utils/                # Test utilities
└── types/                # Test type definitions
```

## Development Environment

### DevContainer Configuration (`.devcontainer/`)
```
.devcontainer/
├── containers/           # Container definitions
├── scripts/              # Setup and lifecycle scripts
├── devcontainer.json     # VS Code dev container config
└── docker-compose.yml    # Multi-service setup
```

### Documentation (`.docs/`)
```
.docs/
├── docker/               # Docker setup guides
├── API.md               # API documentation
├── architecture-simplified.md # Architecture overview
├── ddd-migration-accounts.md # DDD migration guide
└── [various guides]      # Technical documentation
```

## Architectural Patterns

### Layered Architecture
1. **Controllers**: HTTP request/response handling
2. **Services**: Business logic and data processing
3. **Models**: Database schema and data access
4. **Schemas**: Input/output validation
5. **Mappers**: Data transformation between layers

### Multi-tenant Design
- **Realm-scoped**: All operations are tenant-aware
- **Data Isolation**: Complete separation per tenant
- **Context Propagation**: Tenant context flows through all layers
- **Security Boundaries**: Tenant-specific authentication and authorization

### Route Organization
- **Hierarchical**: Routes organized by domain and context
- **MagicRouter**: Enhanced routing with automatic validation
- **API Versioning**: Structured API paths (`/api/{context}/{domain}`)
- **Documentation**: Automatic OpenAPI generation

### Error Handling
- **Centralized**: Global error middleware
- **Typed Errors**: Custom error classes for different scenarios
- **Consistent Responses**: Standardized error response format
- **Logging Integration**: Structured error logging

## Configuration Management

### Environment Configuration
- **Multi-environment**: Development, testing, production
- **Docker Integration**: Container-based development
- **Secret Management**: Secure credential handling
- **Feature Flags**: Configurable system behavior

### Build and Development
- **TypeScript**: Full type safety and modern JavaScript features
- **Hot Reload**: Development server with automatic restart
- **Linting**: ESLint with TypeScript support
- **Testing**: Vitest with coverage reporting
- **Type Checking**: Strict TypeScript compilation