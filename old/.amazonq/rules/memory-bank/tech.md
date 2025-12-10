# Technology Stack - Backend-Koa IAM

## Programming Languages

### TypeScript 5.9.3
- Primary language for all application code
- Strict type checking enabled
- Path aliases configured: `@/` (src), `@test/` (tests)
- Extends `@tsconfig/node22` base configuration

### Node.js 22+
- Runtime environment
- ES Modules support
- Async/await patterns throughout

## Core Framework and Libraries

### Web Framework
- **Koa.js 3.1.1**: Lightweight web framework
- **@koa/router 14.0.0**: HTTP routing
- **@koa/bodyparser 6.0.0**: Request body parsing
- **@koa/cors 5.0.0**: CORS middleware
- **koa-mount 4.2.0**: Application mounting
- **koa-static 5.0.0**: Static file serving

### Database
- **MongoDB**: Primary database (via Docker)
- **Mongoose 9.0.0**: ODM for MongoDB
- **mongodb-memory-server 10.3.0**: In-memory MongoDB for tests

### Validation and Schemas
- **Zod 4.1.12**: Runtime type validation
- **@asteasolutions/zod-to-openapi 8.1.0**: OpenAPI schema generation

### Authentication and Security
- **jsonwebtoken 9.0.2**: JWT token generation/verification
- **bcrypt 6.0.0**: Password hashing
- **uuid 13.0.0**: UUID generation (v4)

### Logging and Observability
- **Pino 10.1.0**: Structured logging
- **pino-caller 4.0.0**: Caller information in logs
- **pino-pretty 13.1.2**: Pretty-print logs (dev)
- **@opentelemetry/api 1.9.0**: Telemetry API
- **@opentelemetry/sdk-node 0.208.0**: OpenTelemetry SDK
- **@opentelemetry/auto-instrumentations-node 0.67.0**: Auto-instrumentation
- **@opentelemetry/exporter-prometheus 0.208.0**: Prometheus metrics
- **@opentelemetry/exporter-trace-otlp-http 0.208.0**: OTLP trace export

### API Documentation
- **swagger-ui-dist 5.30.2**: Swagger UI for interactive docs

### Utilities
- **dotenv 17.2.3**: Environment variable management
- **axios 1.13.2**: HTTP client
- **ms 2.1.3**: Time string parsing

## Development Tools

### Build System
- **Rollup 4.53.3**: Module bundler
- **@rollup/plugin-typescript 12.3.0**: TypeScript plugin
- **@rollup/plugin-replace 6.0.3**: Environment variable replacement
- **tslib 2.8.1**: TypeScript runtime library
- **tsc-alias 1.8.16**: Path alias resolution

### Testing
- **Vitest 4.0.13**: Test runner (Vite-powered)
- **@vitest/coverage-v8 4.0.13**: Code coverage
- **Supertest 7.1.4**: HTTP assertion library
- **vite-tsconfig-paths 5.1.4**: Path alias support in tests

### Code Quality
- **ESLint 9.39.1**: Linting
- **@typescript-eslint/eslint-plugin 8.47.0**: TypeScript linting rules
- **@typescript-eslint/parser 8.47.0**: TypeScript parser
- **Prettier 3.6.2**: Code formatting
- **eslint-config-prettier 10.1.8**: Disable conflicting ESLint rules
- **eslint-plugin-prettier 5.5.4**: Run Prettier as ESLint rule
- **eslint-import-resolver-typescript 4.4.4**: Resolve TypeScript imports

### Development Server
- **Nodemon 3.1.11**: Auto-restart on file changes
- **ts-node 10.9.2**: TypeScript execution
- **ts-node-dev 2.0.0**: Fast TypeScript development
- **tsconfig-paths 4.2.0**: Path mapping support

### Maintenance Tools
- **Knip 5.71.0**: Find unused files, dependencies, exports
- **npm-check-updates 19.1.2**: Update dependencies

## Development Commands

### Primary Commands
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build production bundle with Rollup
npm test                 # Run all tests once
npm run lint             # Check code style
npm run lint:fix         # Fix code style issues
npm run type-check       # TypeScript type checking (strict)
```

### Testing Commands
```bash
npm run test:watch       # Run tests in watch mode
npm run test:unit        # Run unit tests only
npm run test:int         # Run integration tests only
npm run test:parallel    # Run tests in parallel with verbose output
npm run test:int:parallel # Run integration tests in parallel
npm run test:coverage    # Generate coverage report (text)
npm run test:coverage-json # Generate coverage JSON (silent)
npm run test:coverage:ui # Interactive coverage UI
npm run test:unit:coverage # Unit test coverage
npm run test:int:coverage  # Integration test coverage
```

### Maintenance Commands
```bash
npm run knip             # Find unused code and dependencies
npm run ncu              # Update dependencies to latest versions
```

## Build Configuration

### TypeScript Configuration
- **Base**: `@tsconfig/node22`
- **Source maps**: Enabled
- **Path aliases**: `@/*` → `src/*`, `@test/*` → `tests/*`
- **Strict mode**: Enabled for type checking
- **Include**: `src/**/*.ts`, `tests/**/*.ts`

### Rollup Configuration
- Bundles TypeScript to JavaScript
- Replaces environment variables
- Outputs to `dist/` directory

### Vitest Configuration
- Uses Vite for fast test execution
- Coverage with V8 provider
- Path alias support via `vite-tsconfig-paths`
- Global setup/teardown for MongoDB

## Environment Configuration

### Environment Files
- `.env`: Base configuration
- `.env.development.local`: Local development overrides
- `.env.test`: Test environment configuration

### Key Environment Variables
- `NODE_ENV`: Environment (development, test, production)
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `LOG_LEVEL`: Logging level (debug, info, warn, error)
- `LOGGER_LEVEL`: Alternative logging level variable

## Docker Configuration

### DevContainer
- MongoDB 7.0 container
- Node.js 22 workspace container
- Volume mounts for code and MongoDB data
- VSCode extensions pre-configured:
  - Vitest Explorer
  - Prettier
  - ESLint
  - Amazon Q

### Docker Compose
- Multi-container setup for development
- MongoDB with persistent volume
- Network configuration for service communication

## API Standards

### OpenAPI/Swagger
- OpenAPI 3.0 specification
- Generated from Zod schemas
- Interactive documentation at `/docs`
- Schema validation for requests/responses

### HTTP Standards
- RESTful API design
- JSON request/response bodies
- Standard HTTP status codes
- CORS support

## Security Standards

### Password Security
- OWASP-compliant password policies
- Bcrypt hashing with salt rounds
- Minimum password requirements enforced

### JWT Security
- Tenant-specific secrets
- Configurable expiration
- Bearer token authentication
- Token verification middleware

### Input Validation
- Zod schema validation on all inputs
- Type-safe request handling
- Sanitized database names for multi-tenancy

## Observability

### Logging
- Structured JSON logs with Pino
- Request ID tracking
- Caller information in logs
- Context-aware logging (Koa vs non-Koa)

### Tracing
- OpenTelemetry distributed tracing
- Automatic instrumentation
- OTLP export to collectors
- Span context propagation

### Metrics
- Prometheus metrics export
- Custom application metrics
- HTTP request metrics

## Code Quality Standards

### Linting
- TypeScript ESLint rules
- Prettier integration
- Import resolver for TypeScript paths
- Strict type checking

### Testing
- Unit tests for isolated logic
- Integration tests for API endpoints
- 100% code coverage target
- MongoDB in-memory for test isolation

### Type Safety
- No `any` types allowed
- Strict null checks
- Explicit return types
- Type inference where appropriate
