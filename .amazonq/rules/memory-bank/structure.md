# Project Structure

## Root Directory Organization

### Core Application
- **src/**: Main application source code
- **tests/**: Comprehensive test suites (unit and integration)
- **.devcontainer/**: Docker development environment configuration
- **.docs/**: Project documentation and guides

### Configuration Files
- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **vitest.config.mjs**: Test runner configuration
- **eslint.config.mjs**: Code linting rules
- **prettier.config.mjs**: Code formatting rules

## Source Code Architecture (src/)

### Domain-Driven Design Structure
```
src/domains/
├── commons/          # Shared base components
├── config/           # Configuration management
├── core/             # Core system functionality
├── realms/           # Multi-tenant realm management
└── swagger/          # API documentation
```

### Supporting Infrastructure
```
src/
├── errors/           # Custom error classes
├── middlewares/      # Koa middleware functions
├── plugins/          # System plugins (database, logging, etc.)
└── utils/            # Utility functions and helpers
```

## Domain Organization Pattern

Each domain follows a consistent structure:
```
domains/{context}/{domain}/
├── {domain}.controller.ts
├── {domain}.service.ts
├── {domain}.model.ts
├── {domain}.schema.ts
└── {domain}.routes.ts
```

## Key Architectural Components

### Controllers
- Handle HTTP requests and responses
- Validate input using Zod schemas
- Delegate business logic to services
- Located in `{domain}.controller.ts`

### Services
- Contain business logic and rules
- Interact with database models
- Follow tenant-first parameter pattern
- Located in `{domain}.service.ts`

### Models
- Define database schemas and validation
- Use Mongoose with UUID-based identifiers
- Extend base document schema
- Located in `{domain}.model.ts`

### Routes
- Define API endpoints using MagicRouter
- Include OpenAPI/Swagger specifications
- Direct implementation without versioning layers
- Located in `{domain}.routes.ts`

### Schemas
- Zod validation schemas for API requests/responses
- Type-safe input/output validation
- Reusable schema components
- Located in `{domain}.schema.ts`

## Test Organization

### Integration Tests
```
tests/integration/domains/{context}/{domain}/
├── post.test.ts      # Create operations
├── get.id.test.ts    # Read by ID operations
└── get.search.test.ts # Search operations
```

### Unit Tests
```
tests/unit/domains/{context}/{domain}/
├── {domain}.service.test.ts
├── {domain}.controller.test.ts
└── {domain}.model.test.ts
```

## Multi-tenant Architecture

### Tenant Isolation
- Database-level tenant separation
- Tenant-scoped API endpoints
- UUID-based tenant identification
- Secure tenant context validation

### API Structure
- Standard: `/api/{context}/{domain}/{endpoint}`
- Tenant-scoped: `/api/{context}/realm/{tenantId}/{domain}/{endpoint}`

## Development Environment

### Docker Configuration
- MongoDB container for data persistence
- Workspace container for development
- Volume mounts for code and data
- Automated setup scripts

### Development Tools
- Hot reload with nodemon
- Comprehensive linting with ESLint
- Code formatting with Prettier
- Test coverage reporting with Vitest