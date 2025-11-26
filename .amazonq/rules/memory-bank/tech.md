# Technology Stack

## Programming Languages

### TypeScript 5.9.3
- **Configuration**: Extends `@tsconfig/node22` for Node.js 22 compatibility
- **Strict Mode**: Enabled for maximum type safety
- **Path Aliases**: `@/*` for src, `@test/*` for tests
- **Target**: ES2022 with Node.js 22 runtime

## Core Framework & Runtime

### Node.js 22
- **Runtime**: Latest LTS with modern JavaScript features
- **Package Manager**: npm with package-lock.json

### Koa.js 3.1.1
- **Web Framework**: Lightweight, middleware-based HTTP server
- **Middleware Stack**:
  - `@koa/bodyparser`: Request body parsing
  - `@koa/cors`: Cross-origin resource sharing
  - `@koa/router`: HTTP routing (base for MagicRouter)
  - `koa-logger`: HTTP request logging
  - `koa-mount`: Application mounting
  - `koa-static`: Static file serving

## Database & ODM

### MongoDB
- **Version**: Compatible with Mongoose 9.0.0
- **Development**: MongoDB Memory Server for testing
- **Connection**: Mongoose connection pooling
- **Multi-Tenancy**: Separate databases per tenant

### Mongoose 9.0.0
- **ODM**: Object-Document Mapping for MongoDB
- **Schema Definition**: TypeScript-integrated schemas
- **UUID Support**: String-based UUIDs as primary keys
- **Validation**: Schema-level validation

## Validation & Type Safety

### Zod 4.1.12
- **Runtime Validation**: Type-safe schema validation
- **OpenAPI Integration**: `@asteasolutions/zod-to-openapi` for API docs
- **Email Validation**: RFC 5322 compliant patterns
- **Password Validation**: OWASP-compliant rules

### TypeScript Strict Mode
- **Zero `any` Tolerance**: All types must be explicit
- **Type Checking**: `npm run type-check` enforces zero errors
- **Inference**: Types derived from Zod schemas

## Authentication & Security

### JWT (jsonwebtoken 9.0.2)
- **Token Generation**: Tenant-scoped JWT tokens
- **Signature**: HS256 algorithm
- **Claims**: Custom tenant and user context

### bcrypt 6.0.0
- **Password Hashing**: Industry-standard bcrypt algorithm
- **Salt Rounds**: Configurable for security/performance balance

## API Documentation

### Swagger/OpenAPI 3.0
- **Generator**: Custom MagicRouter integration
- **UI**: swagger-ui-dist 5.30.2
- **Specification**: Auto-generated from Zod schemas
- **Endpoint**: `/docs` for interactive documentation

## Observability & Monitoring

### OpenTelemetry
- **API**: `@opentelemetry/api` 1.9.0
- **SDK**: `@opentelemetry/sdk-node` 0.208.0
- **Auto-Instrumentation**: `@opentelemetry/auto-instrumentations-node` 0.67.0
- **Exporters**:
  - Jaeger 2.2.0 (distributed tracing)
  - Prometheus 0.208.0 (metrics)
- **Semantic Conventions**: 1.38.0

### Pino 10.1.0
- **Structured Logging**: JSON-formatted logs
- **Caller Info**: `pino-caller` 4.0.0 for source location
- **Pretty Print**: `pino-pretty` 13.1.2 for development
- **Context**: AsyncLocalStorage integration

## Testing Framework

### Vitest 4.0.13
- **Test Runner**: Fast, Vite-powered test framework
- **Coverage**: `@vitest/coverage-v8` 4.0.13
- **UI**: Interactive coverage viewer
- **Configuration**: `vitest.config.mjs` with path aliases

### Testing Utilities
- **Supertest 7.1.4**: HTTP assertion library
- **MongoDB Memory Server 10.3.0**: In-memory MongoDB for tests
- **Test Types**: Custom TypeScript definitions in `tests/types/`

## Code Quality Tools

### ESLint 9.39.1
- **Parser**: `@typescript-eslint/parser` 8.47.0
- **Plugin**: `@typescript-eslint/eslint-plugin` 8.47.0
- **Prettier Integration**: `eslint-plugin-prettier` 5.5.4
- **Import Resolution**: `eslint-import-resolver-typescript` 4.4.4

### Prettier 3.6.2
- **Code Formatting**: Consistent code style
- **Config**: `prettier.config.mjs`
- **Integration**: ESLint plugin for unified workflow

## Development Tools

### Nodemon 3.1.11
- **Auto-Reload**: Development server with hot reload
- **Configuration**: `nodemon.json` for TypeScript support

### ts-node 10.9.2
- **TypeScript Execution**: Direct TypeScript execution
- **Dev Mode**: Used by nodemon for development

### npm-check-updates 19.1.2
- **Dependency Management**: Check for package updates
- **Command**: `npm run ncu` to update dependencies

## Utilities

### uuid 13.0.0
- **UUID Generation**: v4 UUIDs for entity IDs
- **Type Support**: `@types/uuid` 11.0.0

### dotenv 17.2.3
- **Environment Variables**: Load from .env files
- **Multi-Environment**: Support for .env.development.local, .env.test

## Development Commands

### Running the Application
```bash
npm run dev              # Start development server with hot reload
```

### Testing
```bash
npm test                 # Run all tests
npm run test:unit        # Run unit tests only
npm run test:int         # Run integration tests only
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:coverage:ui # Interactive coverage viewer
npm run test:coverage-json # Generate JSON coverage for analysis
```

### Code Quality
```bash
npm run lint             # Check code with ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run type-check       # TypeScript type checking (zero errors required)
```

### Dependency Management
```bash
npm run ncu              # Check for package updates
```

## Build Configuration

### TypeScript Compilation
- **No Build Step**: Direct execution via ts-node in development
- **Type Checking**: Separate from runtime via `tsc --noEmit`
- **Path Resolution**: `tsconfig-paths` for alias resolution

### Module Resolution
- **ES Modules**: Modern import/export syntax
- **Path Aliases**: Configured in tsconfig.json and vitest.config.mjs
- **Import Strategy**: Absolute imports with `@/` prefix

## Container Environment

### Docker Development
- **Dev Container**: VS Code devcontainer configuration
- **Services**: MongoDB, application workspace
- **Volumes**: Persistent MongoDB data in `.mongodata/`
- **Scripts**: Pre-create, post-start, post-attach hooks

### VS Code Extensions (Required)
- **vitest.explorer**: Vitest test explorer
- **esbenp.prettier-vscode**: Prettier formatter
- **dbaeumer.vscode-eslint**: ESLint integration
- **AmazonWebServices.amazon-q-vscode**: Amazon Q AI assistant

## Environment Variables

### Required Configuration
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT signing
- **PORT**: HTTP server port (default: 3000)
- **NODE_ENV**: Environment (development, test, production)
- **LOGGER_LEVEL**: Pino log level (debug, info, warn, error)

### Multi-Environment Support
- **.env**: Base configuration
- **.env.development.local**: Local development overrides
- **.env.test**: Test environment (used by Vitest)
