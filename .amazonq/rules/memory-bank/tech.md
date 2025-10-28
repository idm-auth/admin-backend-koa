# Technology Stack

## Core Technologies

### Runtime & Language
- **Node.js**: JavaScript runtime (v22+ recommended)
- **TypeScript**: Type-safe JavaScript development (v5.9.3)
- **Koa.js**: Modern web framework for Node.js (v3.0.3)

### Database & ODM
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling (v8.19.2)
- **MongoDB Memory Server**: In-memory testing database (v10.2.3)

## Key Dependencies

### Web Framework & Middleware
- **@koa/router**: HTTP routing (v14.0.0)
- **@koa/bodyparser**: Request body parsing (v6.0.0)
- **@koa/cors**: Cross-origin resource sharing (v5.0.0)
- **koa-mount**: Application mounting (v4.2.0)
- **koa-static**: Static file serving (v5.0.0)

### Validation & Documentation
- **zod**: Schema validation and type inference (v4.1.12)
- **@asteasolutions/zod-to-openapi**: OpenAPI generation from Zod (v8.1.0)
- **swagger-ui-dist**: API documentation UI (v5.29.5)

### Security & Authentication
- **jsonwebtoken**: JWT token handling (v9.0.2)
- **bcrypt**: Password hashing (v6.0.0)
- **uuid**: UUID generation (v13.0.0)

### Logging & Monitoring
- **pino**: High-performance logging (v10.1.0)
- **pino-caller**: Enhanced logging context (v4.0.0)
- **pino-pretty**: Development log formatting (v13.1.2)

## Development Tools

### Testing Framework
- **vitest**: Fast unit test runner (v4.0.1)
- **@vitest/coverage-v8**: Code coverage reporting (v4.0.1)
- **supertest**: HTTP assertion testing (v7.1.4)

### Code Quality
- **eslint**: JavaScript/TypeScript linting (v9.38.0)
- **@typescript-eslint/**: TypeScript-specific linting rules
- **prettier**: Code formatting (v3.6.2)
- **eslint-config-prettier**: ESLint-Prettier integration

### Development Environment
- **nodemon**: Development server with hot reload (v3.1.10)
- **ts-node**: TypeScript execution (v10.9.2)
- **tsconfig-paths**: Path mapping support (v4.2.0)
- **vite-tsconfig-paths**: Vitest path resolution (v5.1.4)

## Build & Configuration

### TypeScript Configuration
- **@tsconfig/node22**: Node.js 22 TypeScript config (v22.0.2)
- **tsc-alias**: Path alias resolution (v1.8.16)
- Target: ES2022
- Module: CommonJS
- Strict type checking enabled

### Environment Management
- **dotenv**: Environment variable loading (v17.2.3)
- Development and production configurations
- Docker-based development environment

## Development Commands

### Primary Commands
```bash
npm run dev          # Start development server with hot reload
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
```

### Testing Commands
```bash
npm run test:unit           # Run unit tests only
npm run test:int            # Run integration tests only
npm run test:coverage       # Run tests with coverage report
npm run test:coverage:ui    # Run tests with coverage UI
```

### Utility Commands
```bash
npm run ncu         # Check for dependency updates
```

## Architecture Patterns

### Validation Strategy
- Zod schemas for runtime type validation
- OpenAPI generation from schemas
- Type-safe request/response handling

### Database Strategy
- UUID-based document identifiers
- Soft delete implementation
- Multi-tenant data isolation
- Mongoose schema inheritance

### Error Handling
- Custom error classes
- Centralized error middleware
- Structured error responses

### Logging Strategy
- Structured logging with Pino
- Request ID tracking
- Context-aware logging
- Development-friendly formatting

## Performance Considerations

### Database Optimization
- Indexed queries for tenant isolation
- Efficient UUID-based lookups
- Connection pooling with Mongoose

### API Performance
- Lightweight Koa.js framework
- Efficient middleware pipeline
- Structured validation with Zod

### Development Performance
- Fast test execution with Vitest
- Hot reload for rapid development
- Efficient TypeScript compilation