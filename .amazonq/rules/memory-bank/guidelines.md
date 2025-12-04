# Development Guidelines

## Code Quality Standards

### TypeScript Conventions

**Strict Type Safety**
- Zero tolerance for `any` types - use explicit types or `unknown`
- All function parameters and return types must be explicitly typed
- Type declarations preferred over type casting: `const user: User = data` instead of `data as User`
- Interfaces for object shapes, type aliases for unions and primitives

**Import Organization**
- Absolute imports using `@/` prefix for src code: `import { service } from '@/domains/realms/accounts/account.service'`
- Absolute imports using `@test/` prefix for test code: `import { getTenantId } from '@test/utils/tenant.util'`
- Named exports only - no default exports: `export const create = async () => {}`
- Import grouping: external packages, then internal modules
- Wildcard imports for related functions: `import * as accountService from './account.service'`

**Naming Conventions**
- camelCase for variables, functions, and methods
- PascalCase for types, interfaces, and classes
- UPPER_SNAKE_CASE for constants: `const SERVICE_NAME = 'account'`
- Descriptive names that indicate purpose: `findById`, `toCreateResponse`, `accountCreateSchema`
- Prefix boolean variables with `is`, `has`, `should`: `isPrimary`, `hasEmail`

### File Structure Patterns

**Domain Layer Organization**
Each domain follows a flat structure with these files:
- `{domain}.controller.ts` - HTTP handlers using Koa Context
- `{domain}.service.ts` - Business logic with tenant-first parameters
- `{domain}.model.ts` - Mongoose schemas and type definitions
- `{domain}.schema.ts` - Zod validation schemas and inferred types
- `{domain}.mapper.ts` - Data transformation functions
- `{domain}s.routes.ts` - MagicRouter route definitions (note plural)

**Separation of Concerns**
- Controllers: Extract `ctx.validated` data, call services, set response
- Services: Implement business logic, throw domain errors, never return null
- Models: Define data structure, Mongoose schemas, pre-save hooks
- Schemas: Zod validation with OpenAPI extensions, type inference
- Mappers: Transform between internal and external representations
- Routes: MagicRouter definitions with full OpenAPI specifications

## Architectural Patterns

### Multi-Tenant Pattern

**Tenant ID as First Parameter**
```typescript
import { DocId, PublicUUID } from '@/domains/commons/base/base.schema';

// Service functions always receive tenantId first, separated from data
export const create = async (tenantId: PublicUUID, data: EntityCreate): Promise<Entity> => {
  // Implementation
};

export const update = async (tenantId: PublicUUID, id: DocId, data: EntityUpdate): Promise<Entity> => {
  // Implementation
};

export const findById = async (tenantId: PublicUUID, id: DocId): Promise<Entity> => {
  // Implementation
};
```

**Database Isolation**
- Each tenant has a separate MongoDB database
- Database name retrieved via `getDBName({ publicUUID: tenantId })`
- Models instantiated per database: `getModel(dbName)`
- No cross-tenant data access

### Service Layer Patterns

**Error Handling - Never Return Null**
```typescript
import { DocId, PublicUUID } from '@/domains/commons/base/base.schema';

// Services throw specific errors, never return null/undefined
export const findById = async (tenantId: PublicUUID, id: DocId): Promise<Entity> => {
  const entity = await getModel(dbName).findById(id);
  
  if (!entity) {
    throw new NotFoundError('Entity not found');
  }
  
  return entity; // Always return the entity directly
};
```

**Validation Before Operations**
```typescript
import { PublicUUID } from '@/domains/commons/base/base.schema';

export const create = async (tenantId: PublicUUID, data: EntityCreate): Promise<Entity> => {
  // 1. Validate uniqueness/business rules
  await validateEmailUnique(tenantId, data.email);
  
  // 2. Get database context
  const dbName = await getDBName({ publicUUID: tenantId });
  
  // 3. Perform database operation
  const entity = await getModel(dbName).create(data);
  
  // 4. Return result
  return entity;
};
```

### Controller Patterns

**Using Validated Data**
```typescript
export const create = async (ctx: Context) => {
  // Extract validated data from ctx.validated (never ctx.params/query/body directly)
  const { tenantId } = ctx.validated.params;
  const data = ctx.validated.body;
  
  // Call service with tenant-first pattern
  const entity = await service.create(tenantId, data);
  
  // Transform response using mapper
  const response = mapper.toCreateResponse(entity);
  
  // Set status and body
  ctx.status = 201;
  ctx.body = response;
};
```

**No Business Logic in Controllers**
- Controllers orchestrate, services implement
- No validation in controllers (handled by middleware)
- No direct database access
- No data transformation logic (use mappers)

### Routing with MagicRouter

**Complete Route Definitions**
```typescript
router.post({
  name: 'createEntity',           // Unique operation name
  path: '/',                       // Route path
  summary: 'Create entity',        // OpenAPI summary
  handlers: [controller.create],   // Handler functions
  request: {
    params: requestTenantIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: entityCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Entity created successfully',
      content: {
        'application/json': {
          schema: entityResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            details: z.string().optional(),
          }),
        },
      },
    },
  },
  tags: ['Entities'],
});
```

**Router Composition**
```typescript
// Child router with prefix
const childRouter = new MagicRouter({ prefix: '/entities' });

// Parent router uses useMagic for hierarchy
parentRouter.useMagic(childRouter);
```

## Validation & Type Safety

### Zod v4 Patterns

**Schema Definition with OpenAPI**
```typescript
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z); // Required in every schema file

export const entityCreateSchema = z.object({
  email: emailSchema,
  name: z.string().min(1),
});

export type EntityCreate = z.infer<typeof entityCreateSchema>;
```

**Email Validation (RFC 5322)**
```typescript
export const emailSchema = z.email({
  pattern: z.regexes.rfc5322Email,
  error: (issue) =>
    issue.input === undefined || issue.input === ''
      ? 'Email is required'
      : 'Invalid email format',
});
```

**Password Validation (OWASP)**
```typescript
export const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');
```

### Type Location Rules

**Schema Types** (`{domain}.schema.ts`)
- Request/response types
- API contract types
- Validation schemas and inferred types

**Model Types** (`{domain}.model.ts`)
- Database document types
- Mongoose schema types
- Internal data structure types

**Mapper Types**
- Mappers NEVER define their own types
- Always import types from schema or model
- Only transform data, never define structure

## Database Patterns

### Mongoose Schema Conventions

**UUID as Primary Key**
```typescript
import { v4 as uuidv4 } from 'uuid';

const schema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  // other fields
});
```

**Base Schema Extension**
```typescript
import { baseDocumentSchema } from '@/domains/commons/base/base.model';

const schema = new mongoose.Schema({
  // domain-specific fields
});

schema.add(baseDocumentSchema); // Adds _id, createdAt, updatedAt
```

**Pre-Save Hooks**
```typescript
schema.pre('save', async function () {
  if (this.isNew || this.isModified('password')) {
    this.salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, this.salt);
  }
});
```

**Model Factory Pattern**
```typescript
export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<Entity>('entities', schema);
};
```

### Collection Naming
- Lowercase with hyphens for multi-word names: `account-groups`, `group-roles`
- Matches domain directory structure
- Plural form for collections

## Observability Patterns

### Telemetry Integration

**Controller Telemetry**
```typescript
const CONTROLLER_NAME = 'entity';

export const create = async (ctx: Context) => {
  return withSpanAsync({
    name: `${CONTROLLER_NAME}.controller.create`,
    attributes: {
      'tenant.id': ctx.validated.params.tenantId,
      'http.method': 'POST',
      controller: CONTROLLER_NAME,
    },
  }, async () => {
    // Implementation
  });
};
```

**Service Telemetry**
```typescript
import { PublicUUID } from '@/domains/commons/base/base.schema';

const SERVICE_NAME = 'entity';

export const create = async (tenantId: PublicUUID, data: EntityCreate) => {
  return withSpanAsync({
    name: `${SERVICE_NAME}.service.create`,
    attributes: {
      'tenant.id': tenantId,
      operation: 'create',
    },
  }, async (span) => {
    // Implementation
    span.setAttributes({ 'entity.id': entity._id });
    return entity;
  });
};
```

**Mapper Telemetry**
```typescript
const MAPPER_NAME = 'entity';

export const toResponse = (entity: Entity) =>
  withSpan({
    name: `${MAPPER_NAME}.mapper.toResponse`,
    attributes: { 'entity.id': entity._id.toString() },
  }, () => ({
    // Transformation
  }));
```

### Structured Logging

**Logger Context**
```typescript
// In Koa context (controllers)
import { getLogger } from '@/utils/localStorage.util';

// Outside Koa context (services, utilities)
import { getLogger } from '@/plugins/pino.plugin';
```

**Structured Log Format**
```typescript
const logger = await getLogger();

// Object first, message second
logger.info({ tenantId, entityId }, 'Entity created successfully');

// Never use string interpolation for untrusted data
logger.error({ error, tenantId }, 'Failed to create entity');
```

## Testing Patterns

### Test Organization

**Integration Tests** (Priority)
- File naming: `{method}.{endpoint}.test.ts` (e.g., `post.test.ts`, `get.id.test.ts`)
- Location: `tests/integration/domains/{context}/{domain}/`
- Test full request/response cycle
- Use real MongoDB (in-memory)
- Validate HTTP status codes and response schemas

**Unit Tests** (For Gaps Only)
- File naming: `{functionName}.test.ts`
- Location: `tests/unit/domains/{context}/{domain}/{layer}/`
- One file per function
- Test edge cases not covered by integration tests
- Use real implementations, avoid mocks

### Test Setup Patterns

**Integration Test Setup**
```typescript
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { TEST_PASSWORD, createTestEmail } from '@test/utils/test-constants';

describe('POST /api/realm/:tenantId/entities', () => {
  let tenantId: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-unique-name');
  });

  it('should create entity successfully', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/entities`)
      .send({ email: createTestEmail('test') })
      .expect(201);

    const entity: EntityResponse = response.body;
    expect(entity).toHaveProperty('_id');
  });
});
```

**Unit Test Setup**
```typescript
import { describe, expect, it } from 'vitest';
import * as service from '@/domains/realms/entities/entity.service';
import { getTenantId } from '@test/utils/tenant.util';

describe('entity.service.create', () => {
  it('should create entity successfully', async () => {
    const tenantId = await getTenantId('vi-test-db-unique-name');
    const entity = await service.create(tenantId, data);
    expect(entity).toHaveProperty('_id');
  });
});
```

### Test Data Patterns

**Test Credentials**
```typescript
// Always annotate test credentials
const password = TEST_PASSWORD; // Test credential - not production
const email = createTestEmail('prefix'); // Test email - not production
```

**Unique Test Data**
```typescript
import { v4 as uuidv4 } from 'uuid';

// For unique emails in tests
const email = generateTestEmail('prefix', uuidv4());

// For testing 404 scenarios
const nonExistentId = uuidv4();
```

### Validation Patterns

**Type-Safe Assertions**
```typescript
// Declare type for response
const entity: EntityResponse = response.body;

// Use specific property checks
expect(entity).toHaveProperty('_id');
expect(entity.emails).toHaveLength(1);

// Never use generic checks
// AVOID: expect(entity).toBeTruthy()
```

## Security Practices

### Input Validation
- All user input validated with Zod schemas
- Query parameters sanitized with regex patterns
- SSRF prevention in filter parameters: `/^[a-zA-Z0-9\\s@._-]*$/`
- Maximum length constraints on all string inputs

### Password Security
- bcrypt hashing with salt rounds
- OWASP-compliant password requirements
- Password hashing in Mongoose pre-save hooks
- Never log or expose passwords in responses

### Database Security
- Tenant isolation via separate databases
- Database name sanitization
- No direct query string interpolation
- Mongoose parameterized queries

### Error Handling
- Generic error messages to clients
- Detailed errors in structured logs
- No stack traces in production responses
- Request ID tracking for debugging

## Common Code Idioms

### Async/Await Pattern
```typescript
import { PublicUUID } from '@/domains/commons/base/base.schema';

// Always use async/await, never raw Promises
export const create = async (tenantId: PublicUUID, data: EntityCreate): Promise<Entity> => {
  const dbName = await getDBName({ publicUUID: tenantId });
  const entity = await getModel(dbName).create(data);
  return entity;
};
```

### Optional Chaining & Nullish Coalescing
```typescript
// Use optional chaining for safe property access
const email = account.emails?.[0]?.email;

// Use nullish coalescing for defaults
const limit = query.limit ?? 25;
```

### Array Operations
```typescript
// Use array methods for transformations
const data = results.map(mapper.toResponse);

// Use array methods for filtering
const primaryEmail = account.emails.find(e => e.isPrimary);

// Use array methods for validation
const emailExists = account.emails.some(e => e.email === email);
```

### Error Handling Pattern
```typescript
try {
  const result = await operation();
  logger.info({ result }, 'Operation successful');
  return result;
} catch (error) {
  logger.error({ error, context }, 'Operation failed');
  throw error; // Re-throw for middleware handling
}
```

## Documentation Standards

### Code Comments
- Explain WHY, not WHAT (code should be self-documenting)
- Document security considerations: `// NOSONAR: Password hashing handled by pre-save hook`
- Annotate test credentials: `// Test credential - not production`
- No emojis or decorative elements in comments

### Function Documentation
- TypeScript types serve as primary documentation
- Complex business logic requires explanatory comments
- Public APIs documented with JSDoc when needed
- Internal functions rely on clear naming

### README and Markdown
- Professional tone without emojis
- Clear section headers with markdown formatting
- Code examples with proper syntax highlighting
- Bullet points for lists, not decorative icons
