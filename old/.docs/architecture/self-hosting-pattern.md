# Self-Hosting Pattern: IDM as Client of Itself

## Concept

The Backend IDM implements a **self-hosting pattern** where it acts as both:
1. **Authority** - Issues and validates authentication/authorization
2. **Client** - Consumes its own authentication/authorization services via the IDM Client Library

This creates a powerful feedback loop where the IDM backend uses its own product, ensuring the client library is battle-tested in production.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Backend IDM (this project)                     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Protected API Routes                                 │ │
│  │  /api/realm/:tenantId/accounts                        │ │
│  │  /api/realm/:tenantId/groups                          │ │
│  └───────────────────────────────────────────────────────┘ │
│                          ↑                                  │
│                          │ (requires authentication)        │
│                          │                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Authentication Middleware                            │ │
│  │  - Extracts Bearer token from request                │ │
│  │  - Uses @idm-auth/client library                     │ │
│  │  - Validates token via HTTP                          │ │
│  └───────────────────────────────────────────────────────┘ │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  @idm-auth/client Library                            │ │
│  │  - IHttpClient interface                             │ │
│  │  - AxiosHttpClient implementation                    │ │
│  │  - authenticate() function                           │ │
│  │  - authorize() function                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                          ↓ HTTP POST                        │
│                          │ (to IDM_API_URL)                 │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Validation Endpoints (public)                        │ │
│  │  POST /api/realm/:tenantId/auth/validate             │ │
│  │  POST /api/realm/:tenantId/authz/evaluate            │ │
│  └───────────────────────────────────────────────────────┘ │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  JWT Service / Authorization Service                 │ │
│  │  - Validates JWT signature                           │ │
│  │  - Checks token expiration                           │ │
│  │  - Evaluates policies                                │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Flow Example

### Request to Protected Endpoint

1. **Client sends request:**
   ```http
   GET /api/realm/tenant-123/accounts
   Authorization: Bearer eyJhbGc...
   ```

2. **Authentication Middleware intercepts:**
   - Extracts token from `Authorization` header
   - Calls `idmClient.validateToken(tenantId, token, 'backend-koa-iam')`

3. **IDM Client Library makes HTTP request:**
   ```http
   POST http://localhost:3000/api/realm/tenant-123/auth/validate
   Content-Type: application/json
   X-IDM-Application: backend-koa-iam
   
   {
     "token": "eyJhbGc..."
   }
   ```

4. **Validation Endpoint processes:**
   - Receives request (no authentication required - public endpoint)
   - Validates JWT signature with realm's secret
   - Checks expiration
   - Returns validation result

5. **Response flows back:**
   ```json
   {
     "valid": true,
     "payload": {
       "accountId": "account-456",
       "email": "user@example.com"
     }
   }
   ```

6. **Middleware populates context:**
   ```typescript
   ctx.state.tenantId = 'tenant-123';
   ctx.state.user = { accountId: 'account-456' };
   ```

7. **Request proceeds to protected route**

## Key Principles

### 1. Library Agnosticism

The `@idm-auth/client` library is **completely agnostic** of the backend implementation:

- Does not know it's talking to the IDM backend
- Does not know it's in the same process
- Only knows how to make HTTP requests
- Works with any backend that implements the contract

### 2. Self-Validation via HTTP

The IDM backend validates its own tokens **via HTTP**, not direct function calls:

**Why HTTP instead of direct calls?**
- Tests the full request/response cycle
- Validates serialization/deserialization
- Ensures the API contract works
- Simulates real client usage
- Catches integration issues early

### 3. Dog Fooding

The IDM backend is its own first customer:

- If the library works for the IDM, it works for everyone
- Real production usage, not synthetic tests
- Forces good API design
- Immediate feedback on library changes

### 4. Separation of Concerns

**Protected Endpoints:**
- Require authentication via middleware
- Use `@idm-auth/client` library
- Business logic endpoints

**Validation Endpoints:**
- Public (no authentication required)
- Provide authentication/authorization services
- Used by the library

## Benefits

### For the Backend
- Uses its own product (dog fooding)
- Real-world testing of the client library
- Consistent authentication across all routes
- Easy to add new authentication methods

### For the Library
- Battle-tested in production
- Real use case drives development
- Immediate feedback on API changes
- Proven to work at scale

### For Other Applications
- Library proven to work with the IDM
- Same patterns can be replicated
- Confidence in library stability
- Reference implementation available

## Configuration

### Backend Environment Variables

```env
# IDM_API_URL points to itself
IDM_API_URL=http://localhost:3000
```

In production with multiple instances:
```env
# Points to load balancer
IDM_API_URL=https://idm.example.com
```

### Library Usage in Backend

```typescript
// src/domains/commons/idm-client/idm-client.service.ts
import { authenticate } from '@idm-auth/client';
import { AxiosHttpClient } from '@/utils/http/AxiosHttpClient';
import { PublicUUID } from '@/domains/commons/base/base.schema';

const httpClient = new AxiosHttpClient(10000);

export const validateToken = async (
  tenantId: PublicUUID,
  token: string,
  application: string
) => {
  const idmUrl = getEnvValue(EnvKey.IDM_API_URL);
  
  return authenticate(httpClient, idmUrl, {
    tenantId,
    token,
    application,
  });
};
```

## Comparison with Direct Validation

### Direct Validation (Not Used)
```typescript
// Middleware calls service directly
const payload = await jwtService.verifyToken(tenantId, token);
```

**Problems:**
- Doesn't test the HTTP API
- Library not validated in production
- Different code path than external clients
- Integration issues not caught

### HTTP Validation (Current Approach)
```typescript
// Middleware uses library, library calls HTTP API
const result = await idmClient.validateToken(tenantId, token, app);
```

**Benefits:**
- Tests full HTTP cycle
- Library validated in production
- Same code path as external clients
- Integration issues caught immediately

## Future Considerations

### Performance
- HTTP overhead is minimal (localhost)
- Can add caching layer if needed
- Telemetry tracks performance

### Scalability
- Works with load balancers
- Can point to different IDM instances
- Supports distributed deployments

### Testing
- Easy to mock HTTP client in tests
- Can test against real IDM instance
- Integration tests use same flow
