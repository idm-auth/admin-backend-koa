# Development Guidelines - Backend-Koa IAM

## Code Quality Standards

### TypeScript Conventions

#### Type Safety
- **Strict mode enabled**: All code must pass `npm run type-check` with zero errors
- **No `any` types**: Use specific types or `unknown` when type is truly unknown
- **Explicit typing**: Function parameters and return types must be explicitly typed
- **Type inference**: Let TypeScript infer types for variables when obvious from assignment
- **Interface vs Type**: Use `interface` for object shapes, `type` for unions and complex types

#### Module System
- **Named exports only**: Use `export const functionName` - never `export default`
- **Import organization**: Group imports by source (external → internal → relative)
- **Path aliases**: Always use `@/` for src imports, `@test/` for test imports
- **Static imports**: All imports at top of file - no dynamic imports

Example:
```typescript
// External dependencies
import { Context } from 'koa';
import bcrypt from 'bcrypt';

// Internal with path aliases
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { NotFoundError } from '@/errors/not-found';

// Relative imports (within same domain)
import * as accountService from './account.service';
import { Account } from './account.model';
```

### Code Formatting

#### Naming Conventions
- **Files**: kebab-case (e.g., `account.controller.ts`, `account-groups.routes.ts`)
- **Variables/Functions**: camelCase (e.g., `findById`, `tenantId`)
- **Types/Interfaces**: PascalCase (e.g., `Account`, `AccountCreate`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `SERVICE_NAME`, `CONTROLLER_NAME`)
- **Private fields**: Prefix with underscore (e.g., `_id`)

#### File Structure
- Imports first (external, internal, relative)
- Constants after imports
- Type definitions
- Function implementations
- Exports at declaration point (not at end of file)

#### Code Style
- **Line length**: Prefer breaking at 80-100 characters
- **Indentation**: 2 spaces (enforced by Prettier)
- **Semicolons**: Required at end of statements
- **Quotes**: Single quotes for strings, backticks for templates
- **Trailing commas**: Required in multi-line objects/arrays
- **Arrow functions**: Preferred over function expressions

### Documentation Standards

#### Comments
- **Minimal comments**: Code should be self-documenting through clear naming
- **When to comment**: Complex business logic, non-obvious workarounds, security notes
- **JSDoc**: Not required for internal functions (types provide documentation)
- **TODO comments**: Avoid - use issue tracker instead

#### Special Comment Patterns
```typescript
// NOSONAR: Password hashing is handled by Mongoose pre-save hook
// See account.model.ts line 33-40 for bcrypt.hash() implementation
account.password = passwordParsed;

// Test credential - not production - qdeveloper bug - do not remove
email: generateTestEmail('test'),
```

## Architectural Patterns

### Domain-Driven Design (DDD)

#### Domain Structure
Every domain follows this exact structure:
```
domain-name/
├── {entity}.controller.ts   # HTTP handlers
├── {entity}.service.ts      # Business logic
├── {entity}.model.ts        # MongoDB schema
├── {entity}.schema.ts       # Zod validation
├── {entity}.mapper.ts       # Data transformation
└── {entity}.routes.ts       # Route definitions
```

#### Layer Responsibilities

**Controllers** (`*.controller.ts`):
- Handle HTTP request/response
- Extract validated data from `ctx.validated`
- Call service functions
- Map service results to responses
- Set HTTP status codes
- **Never** contain business logic
- **Always** wrapped in `withSpanAsync` for telemetry

Pattern:
```typescript
export const create = async (ctx: Context) => {
  return withSpanAsync({
    name: `${CONTROLLER_NAME}.controller.create`,
    attributes: {
      'tenant.id': ctx.validated.params.tenantId,
      'http.method': 'POST',
      controller: CONTROLLER_NAME,
    },
  }, async () => {
    const logger = await getLogger();
    const { tenantId } = ctx.validated.params;
    
    const entity = await service.create(tenantId, ctx.validated.body);
    const response = mapper.toCreateResponse(entity);
    
    logger.info({ tenantId, entityId: entity._id }, 'Entity created');
    
    ctx.status = 201;
    ctx.body = response;
  });
};
```

**Services** (`*.service.ts`):
- Implement all business logic
- Validate business rules
- Interact with models (database)
- **Always** throw specific errors (NotFoundError, ValidationError, etc.)
- **Never** return null/undefined - throw error instead
- **Always** wrapped in `withSpanAsync` for telemetry
- **Tenant ID first parameter** - always separate, never grouped

Pattern:
```typescript
export const findById = async (
  tenantId: PublicUUID,
  id: DocId
): Promise<Account> => {
  return withSpanAsync({
    name: `${SERVICE_NAME}.service.findById`,
    attributes: {
      'tenant.id': tenantId,
      'account.id': id,
      operation: 'findById',
    },
  }, async (span) => {
    const logger = await getLogger();
    const dbName = await getDBName({ publicUUID: tenantId });
    const account = await getModel(dbName).findById(id);
    
    if (!account) {
      throw new NotFoundError('Account not found');
    }
    
    span.setAttributes({ 'db.name': dbName });
    return account;
  });
};
```

**Models** (`*.model.ts`):
- Define MongoDB schemas with Mongoose
- Define TypeScript types from schemas
- Implement pre/post hooks (e.g., password hashing)
- Export `getModel(dbName)` function for multi-tenancy
- Use `baseDocumentSchema` for common fields (_id, createdAt, updatedAt)

Pattern:
```typescript
import { baseDocumentSchema } from '@/domains/commons/base/base.model';
import mongoose, { InferSchemaType } from 'mongoose';

const schema = new mongoose.Schema({
  emails: [{ email: String, isPrimary: Boolean }],
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

schema.add(baseDocumentSchema);

export type AccountSchema = InferSchemaType<typeof schema>;
export type Account = mongoose.Document & AccountSchema & BaseDocument;

schema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<Account>('accounts', schema);
};
```

**Schemas** (`*.schema.ts`):
- Define Zod validation schemas
- Export TypeScript types from Zod schemas
- **Always** call `extendZodWithOpenApi(z)` after imports
- Reuse common schemas from `@/domains/commons/base/base.schema`
- Define request/response schemas separately

Pattern:
```typescript
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { emailSchema, passwordSchema, DocIdSchema } from '@/domains/commons/base/base.schema';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const accountCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const accountResponseSchema = z.strictObject({
  _id: DocIdSchema,
  emails: z.array(z.object({ email: emailSchema, isPrimary: z.boolean() })),
  isActive: z.boolean(),
});

export type AccountCreate = z.infer<typeof accountCreateSchema>;
export type AccountResponse = z.infer<typeof accountResponseSchema>;
```

**Mappers** (`*.mapper.ts`):
- Transform data between layers (Model → Response)
- **Never** define types - import from schema
- **Always** wrapped in `withSpan` for telemetry
- Keep transformations simple and pure

Pattern:
```typescript
import { withSpan } from '@/utils/tracing.util';
import { Account } from './account.model';
import { AccountResponse } from './account.schema';

const MAPPER_NAME = 'account';

export const toCreateResponse = (account: Account): AccountResponse => {
  return withSpan({
    name: `${MAPPER_NAME}.mapper.toCreateResponse`,
    attributes: { 'account.id': account._id.toString() },
  }, () => ({
    _id: account._id.toString(),
    emails: account.emails,
    isActive: account.isActive,
  }));
};
```

**Routes** (`*.routes.ts`):
- Define HTTP routes with MagicRouter
- Specify OpenAPI documentation inline
- Define authentication requirements
- Link to controller handlers
- Use Zod schemas for validation

Pattern:
```typescript
import { MagicRouter } from '@/utils/core/MagicRouter';
import * as controller from './account.controller';
import { accountCreateSchema, accountResponseSchema } from './account.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  
  router.post({
    name: 'createAccount',
    path: '/',
    summary: 'Create account',
    authentication: { someOneMethod: true },
    handlers: [controller.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': { schema: accountCreateSchema },
        },
      },
    },
    responses: {
      201: {
        description: 'Account created successfully',
        content: {
          'application/json': { schema: accountResponseSchema },
        },
      },
    },
    tags: ['Accounts'],
  });
  
  return router;
};
```

### Multi-tenant Pattern

#### Tenant ID Parameter
- **Always first parameter** in service functions
- **Always separate** - never grouped with other data
- **Type**: `PublicUUID` from `@/domains/commons/base/base.schema`

```typescript
// ✅ Correct
export const create = async (
  tenantId: PublicUUID,
  data: EntityCreate
): Promise<Entity> => { /* ... */ };

export const update = async (
  tenantId: PublicUUID,
  id: DocId,
  data: EntityUpdate
): Promise<Entity> => { /* ... */ };

// ❌ Incorrect - grouped parameters
export const create = async (args: {
  tenantId: PublicUUID;
  data: EntityCreate;
}): Promise<Entity> => { /* ... */ };
```

#### Database Isolation
- Each tenant has separate MongoDB database
- Database name from `getDBName({ publicUUID: tenantId })`
- Models retrieved via `getModel(dbName)`
- Connection pooling handled by `mongo.plugin.ts`

### Error Handling

#### Custom Error Classes
All errors extend base Error with statusCode:
- `NotFoundError` (404): Resource not found
- `ValidationError` (400): Invalid input
- `UnauthorizedError` (401): Authentication failed
- `ForbiddenError` (403): Authorization failed
- `ConflictError` (409): Resource conflict (e.g., duplicate email)

Pattern:
```typescript
export class NotFoundError extends Error {
  public readonly statusCode = 404;
  
  constructor(message: string = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

#### Error Usage
- **Services throw errors** - never return null/undefined
- **Controllers catch via middleware** - errorHandler.middleware.ts
- **Specific errors for specific cases**

```typescript
// Service
const account = await getModel(dbName).findById(id);
if (!account) {
  throw new NotFoundError('Account not found');
}
return account; // Always return object when found

// ConflictError with details
throw new ConflictError('Email already exists', {
  field: 'email',
  details: 'This email is already registered',
});
```

### Validation Pattern

#### Zod Schema Validation
- All input validated with Zod schemas
- Validation happens in middleware before controller
- Controllers access validated data via `ctx.validated`
- **Never** validate twice - trust `ctx.validated`

```typescript
// Route definition
request: {
  params: requestTenantIdParamsSchema,
  body: {
    content: {
      'application/json': { schema: accountCreateSchema },
    },
  },
}

// Controller usage
export const create = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params; // Already validated
  const data = ctx.validated.body; // Already validated
  // No need to validate again
};
```

#### Common Validation Schemas
Reuse from `@/domains/commons/base/base.schema`:
- `emailSchema`: Email validation
- `passwordSchema`: Password with OWASP rules
- `DocIdSchema`: UUID v4 validation
- `publicUUIDSchema`: Public UUID validation

### Logging Pattern

#### Structured Logging with Pino
- **Always** use logger, never `console.log`
- **Context-aware**: Different imports for Koa vs non-Koa contexts
- **Structured format**: Object first, message second

```typescript
// In Koa context (controllers, middlewares)
import { getLogger } from '@/utils/localStorage.util';

// Outside Koa context (services, utilities)
import { getLogger } from '@/plugins/pino.plugin';

// Usage
const logger = await getLogger();
logger.info({ tenantId, accountId }, 'Account created successfully');
logger.error({ error, tenantId }, 'Failed to create account');
logger.debug({ data }, 'Processing request');
```

#### Log Levels
- `debug`: Detailed information for debugging
- `info`: General informational messages
- `warn`: Warning messages for potential issues
- `error`: Error messages with error objects

### Telemetry Pattern

#### OpenTelemetry Tracing
- **Controllers**: Use `withSpanAsync` wrapper
- **Services**: Use `withSpanAsync` wrapper
- **Mappers**: Use `withSpan` wrapper (synchronous)
- **Never** create spans manually

```typescript
// Controller
return withSpanAsync({
  name: `${CONTROLLER_NAME}.controller.create`,
  attributes: {
    'tenant.id': ctx.validated.params.tenantId,
    'http.method': 'POST',
    controller: CONTROLLER_NAME,
  },
}, async () => { /* implementation */ });

// Service
return withSpanAsync({
  name: `${SERVICE_NAME}.service.create`,
  attributes: {
    'tenant.id': tenantId,
    operation: 'create',
  },
}, async (span) => {
  // implementation
  span.setAttributes({ 'entity.id': entity._id });
  return entity;
});

// Mapper
return withSpan({
  name: `${MAPPER_NAME}.mapper.toResponse`,
  attributes: { 'entity.id': entity._id.toString() },
}, () => ({ /* transformation */ }));
```

#### Naming Constants
Define at top of each file:
```typescript
const CONTROLLER_NAME = 'account';
const SERVICE_NAME = 'account';
const MAPPER_NAME = 'account';
```

### Authentication Pattern

#### JWT Authentication
- Routes specify authentication: `authentication: { someOneMethod: true }`
- Middleware validates JWT automatically
- User info available in `ctx.state.user.accountId`
- Tenant ID available in `ctx.state.tenantId`

```typescript
// Route with authentication
router.get({
  name: 'listAccounts',
  path: '/',
  authentication: { someOneMethod: true }, // Requires JWT or API key
  handlers: [controller.findAllPaginated],
  // ...
});

// Controller accessing authenticated user
export const findById = async (ctx: Context) => {
  const authenticatedAccountId = ctx.state.user.accountId;
  const authenticatedTenantId = ctx.state.tenantId;
  // Use for authorization checks
};
```

## Testing Patterns

### Test Organization

#### File Structure
- **Unit tests**: `tests/unit/domains/{context}/{domain}/{layer}/{function}.test.ts`
- **Integration tests**: `tests/integration/domains/{context}/{domain}/{method}.{endpoint}.test.ts`
- **One file per function** for unit tests
- **One file per endpoint** for integration tests

#### Test Utilities
```typescript
// Test constants
import { TEST_PASSWORD } from '@test/utils/test-constants';
import { createTestEmail, generateTestEmailWithUUID } from '@test/utils/test-constants';

// Tenant utilities
import { getTenantId } from '@test/utils/tenant.util';

// Mapper test helpers
import { expectMapsObject, expectMapsArray, expectHandlesEmptyArray } from '@test/utils/mapper-test-helpers';
```

### Test Patterns

#### Integration Tests
```typescript
import { getTenantId } from '@test/utils/tenant.util';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import supertest from 'supertest';

describe('POST /api/realm/:tenantId/accounts', () => {
  let tenantId: string;
  
  beforeAll(async () => {
    tenantId = await getTenantId();
  });
  
  it('should create account successfully', async () => {
    const response = await supertest(globalThis.testKoaApp)
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: createTestEmail('test'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('_id');
    expect(response.body.emails[0].email).toBe(createTestEmail('test'));
  });
});
```

#### Unit Tests
```typescript
import { getTenantId } from '@test/utils/tenant.util';
import * as service from '@/domains/realms/accounts/account.service';

describe('account.service.findById', () => {
  let tenantId: string;
  
  beforeAll(async () => {
    tenantId = await getTenantId('account-service-findById');
  });
  
  it('should throw NotFoundError when account not found', async () => {
    const nonExistentId = uuidv4();
    
    await expect(
      service.findById(tenantId, nonExistentId)
    ).rejects.toThrow(NotFoundError);
  });
});
```

### Test Credentials Comment
Always add comment to test credentials:
```typescript
email: generateTestEmail('test'), // Test credential - not production - qdeveloper bug - do not remove
password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
.set('Authorization', `Bearer ${token}`) // Test credential - not production - qdeveloper bug - do not remove
```

## Common Code Idioms

### Async/Await Pattern
Always use async/await, never raw Promises:
```typescript
// ✅ Correct
const account = await accountService.findById(tenantId, id);

// ❌ Incorrect
accountService.findById(tenantId, id).then(account => { /* ... */ });
```

### Optional Chaining and Nullish Coalescing
```typescript
// Optional chaining
const email = account?.emails?.[0]?.email;

// Nullish coalescing
const limit = query.limit ?? 25;
```

### Array Methods
Prefer functional array methods:
```typescript
// Map
const data = accounts.map(mapper.toListItemResponse);

// Filter
const activeAccounts = accounts.filter(a => a.isActive);

// Find
const primaryEmail = account.emails.find(e => e.isPrimary);

// Some
const hasEmail = account.emails.some(e => e.email === email);
```

### Object Destructuring
```typescript
// Parameters
const { tenantId, id } = ctx.validated.params;
const { email, password } = ctx.validated.body;

// Return values
const { data, pagination } = await service.findAllPaginated(tenantId, query);
```

### Type Assertions (Avoid)
Prefer type declarations over casts:
```typescript
// ✅ Correct - type declaration
const account: Account = await getModel(dbName).findById(id);

// ❌ Incorrect - type cast
const account = await getModel(dbName).findById(id) as Account;
```

## Security Practices

### Password Security
- Hash with bcrypt (10 salt rounds minimum)
- Never log passwords
- Validate with OWASP-compliant rules
- Hash in Mongoose pre-save hook

### Input Validation
- Validate all inputs with Zod schemas
- Sanitize database names for multi-tenancy
- Use regex for filter inputs to prevent injection
- Limit string lengths and numeric ranges

### Authentication
- JWT tokens with tenant-specific secrets
- Bearer token format: `Authorization: Bearer <token>`
- Token expiration enforced
- Middleware validates before controller execution

### Database Security
- Separate databases per tenant
- Sanitized database names
- Indexed unique constraints (e.g., email)
- No direct query string interpolation

## Performance Patterns

### Database Queries
- Use indexes for frequently queried fields
- Implement pagination for list endpoints
- Limit query results (max 100 per page)
- Use projection to select only needed fields

### Connection Pooling
- MongoDB connection pooling via Mongoose
- Reuse connections per tenant database
- Connection management in `mongo.plugin.ts`

### Caching Strategy
- No application-level caching currently
- Rely on MongoDB query optimization
- Consider Redis for future caching needs

## API Design Patterns

### RESTful Conventions
- `GET /resource` - List (paginated)
- `POST /resource` - Create
- `GET /resource/:id` - Read
- `PUT /resource/:id` - Update (full)
- `PATCH /resource/:id` - Update (partial)
- `DELETE /resource/:id` - Delete

### Response Formats
- Success: JSON with data
- Error: JSON with error message and optional details
- Pagination: `{ data: [], pagination: { page, limit, total, totalPages } }`

### Status Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Authorization failed
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `500 Internal Server Error` - Server error
