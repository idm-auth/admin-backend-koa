# Technology Stack - Backend-Koa IAM

## Programming Languages and Runtime

### Primary Language
- **TypeScript 5.9.3**: Full type safety with modern JavaScript features
- **Node.js 22+**: Latest LTS runtime with performance optimizations
- **Target**: ES2022 with strict type checking

### Configuration
- **tsconfig.json**: Strict TypeScript configuration with path mapping
- **@tsconfig/node22**: Base configuration for Node.js 22
- **Path Aliases**: `@/` for src, `@test/` for tests

## Core Framework and Server

### Web Framework
- **Koa.js 3.0.3**: Lightweight, modern Node.js web framework
- **@koa/router 14.0.0**: Advanced routing with middleware support
- **@koa/bodyparser 6.0.0**: Request body parsing
- **@koa/cors 5.0.0**: Cross-origin resource sharing

### Server Enhancements
- **koa-logger 4.0.0**: HTTP request logging
- **koa-mount 4.2.0**: Application mounting
- **koa-static 5.0.0**: Static file serving

## Database and Data Management

### Database System
- **MongoDB**: Document-based NoSQL database
- **Mongoose 8.19.2**: MongoDB object modeling with TypeScript support
- **mongodb-memory-server 10.2.3**: In-memory MongoDB for testing

### Data Validation
- **Zod 4.1.12**: Runtime type validation and schema definition
- **@asteasolutions/zod-to-openapi 8.1.0**: OpenAPI generation from Zod schemas

## Authentication and Security

### Authentication
- **jsonwebtoken 9.0.2**: JWT token generation and verification
- **@types/jsonwebtoken 9.0.10**: TypeScript definitions
- **bcrypt 6.0.0**: Password hashing and verification
- **@types/bcrypt 6.0.0**: TypeScript definitions

### Security Features
- **uuid 13.0.0**: Secure unique identifier generation
- **@types/uuid 11.0.0**: TypeScript definitions
- **OWASP-compliant**: Password policies and security practices

## Observability and Monitoring

### Logging
- **pino 10.1.0**: High-performance structured logging
- **pino-caller 4.0.0**: Caller information in logs
- **pino-pretty 13.1.2**: Pretty-printed logs for development

### Tracing and Telemetry
- **@opentelemetry/api 1.9.0**: OpenTelemetry API
- **@opentelemetry/sdk-node 0.208.0**: Node.js SDK
- **@opentelemetry/auto-instrumentations-node 0.67.0**: Automatic instrumentation
- **@opentelemetry/resources 2.2.0**: Resource management
- **@opentelemetry/semantic-conventions 1.38.0**: Standard conventions

### Exporters
- **@opentelemetry/exporter-jaeger 2.2.0**: Jaeger tracing export
- **@opentelemetry/exporter-prometheus 0.208.0**: Prometheus metrics export

## API Documentation

### Documentation Generation
- **swagger-ui-dist 5.29.5**: Interactive API documentation
- **@types/swagger-ui-dist 3.30.6**: TypeScript definitions
- **OpenAPI 3.0**: Standard API specification format

## Development Tools

### Build and Development
- **nodemon 3.1.10**: Development server with hot reload
- **ts-node 10.9.2**: TypeScript execution for Node.js
- **ts-node-dev 2.0.0**: Development server with TypeScript
- **tsc-alias 1.8.16**: Path alias resolution
- **tsconfig-paths 4.2.0**: Runtime path mapping

### Code Quality
- **ESLint 9.38.0**: JavaScript/TypeScript linting
- **@typescript-eslint/eslint-plugin 8.46.2**: TypeScript-specific rules
- **@typescript-eslint/parser 8.46.2**: TypeScript parser for ESLint
- **eslint-config-prettier 10.1.8**: Prettier integration
- **eslint-plugin-prettier 5.5.4**: Prettier as ESLint rule
- **eslint-import-resolver-typescript 4.4.4**: TypeScript import resolution

### Code Formatting
- **Prettier 3.6.2**: Opinionated code formatter
- **prettier.config.mjs**: Project-specific formatting rules

## Testing Framework

### Test Runner
- **Vitest 4.0.1**: Fast unit test framework with Vite integration
- **@vitest/coverage-v8 4.0.1**: Code coverage reporting
- **vite-tsconfig-paths 5.1.4**: Path mapping for Vite

### Testing Utilities
- **supertest 7.1.4**: HTTP assertion library
- **@types/supertest 6.0.3**: TypeScript definitions
- **mongodb-memory-server 10.2.3**: In-memory database for tests

## Configuration and Environment

### Environment Management
- **dotenv 17.2.3**: Environment variable loading
- **Multi-environment**: Development, testing, production configs

### Package Management
- **npm-check-updates 19.1.1**: Dependency update management
- **package-lock.json**: Exact dependency versions

## Development Commands

### Core Development
```bash
npm run dev              # Start development server with hot reload
npm run type-check       # TypeScript type checking
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
```

### Testing
```bash
npm run test             # Run all tests
npm run test:unit        # Run unit tests only
npm run test:int         # Run integration tests only
npm run test:coverage    # Run tests with coverage report
npm run test:coverage:ui # Interactive coverage report
npm run test:watch       # Watch mode for tests
```

### Specialized Testing
```bash
npm run test:parallel    # Parallel test execution
npm run test:unit:coverage    # Unit test coverage
npm run test:int:coverage     # Integration test coverage
npm run test:int:parallel     # Parallel integration tests
```

### Maintenance
```bash
npm run ncu              # Check for dependency updates
```

## Build Configuration

### TypeScript Configuration
- **Strict Mode**: Enabled for maximum type safety
- **Path Mapping**: Absolute imports with `@/` and `@test/` aliases
- **Target**: ES2022 with Node.js 22 compatibility
- **Module**: CommonJS for Node.js compatibility

### Vitest Configuration
- **Coverage**: V8 provider for accurate coverage reporting
- **Path Resolution**: TypeScript path mapping support
- **Test Environment**: Node.js environment
- **Parallel Execution**: Optimized for CI/CD pipelines

### ESLint Configuration
- **TypeScript Integration**: Full TypeScript support
- **Prettier Integration**: Automatic code formatting
- **Import Resolution**: TypeScript-aware import checking
- **Modern JavaScript**: ES2022+ feature support

## Container and Deployment

### Development Environment
- **Docker**: Containerized development environment
- **Docker Compose**: Multi-service orchestration
- **DevContainer**: VS Code development container support
- **MongoDB**: Containerized database for development

### Production Considerations
- **Node.js 22**: LTS runtime for stability
- **Environment Variables**: Secure configuration management
- **Health Checks**: Application health monitoring
- **Graceful Shutdown**: Proper resource cleanup