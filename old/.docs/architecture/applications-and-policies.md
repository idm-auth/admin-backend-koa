# Applications and Policies

## Overview

The IAM system uses **Applications** to register systems and their available actions, which helps users construct **Policies** with correct GRN (Global Resource Name) patterns.

## Application Registration

### Purpose

Applications register their available actions to:
1. **Document** what actions the system supports
2. **Help users** construct GRN patterns when creating policies
3. **Provide reference** for authorization validation

### Schema

```typescript
{
  systemId: string;           // Unique identifier (e.g., 'iam-system')
  name: string;               // Display name
  availableActions: [
    {
      resourceType: string;   // Resource identifier (e.g., 'realm.accounts')
      pathPattern: string;    // Full URL pattern (e.g., '/api/realm/:tenantId/accounts/:id')
      operations: string[];   // Allowed operations (e.g., ['create', 'read', 'update', 'delete'])
    }
  ]
}
```

### Example: IAM System Application

```json
{
  "systemId": "iam-system",
  "name": "IAM System",
  "availableActions": [
    {
      "resourceType": "realm.accounts",
      "pathPattern": "/api/realm/:tenantId/accounts/:id",
      "operations": ["create", "read", "update", "delete", "list"]
    },
    {
      "resourceType": "realm.groups",
      "pathPattern": "/api/realm/:tenantId/groups/:id",
      "operations": ["create", "read", "update", "delete", "list"]
    }
  ]
}
```

## PathPattern Purpose

### What is pathPattern?

The `pathPattern` field stores the **full URL pattern** of each route, including all path parameters.

**Example:**
```
pathPattern: /api/realm/:tenantId/accounts/:id
```

### Why is it needed?

The `pathPattern` helps users understand the **structure of the URL** when creating policies with GRN patterns.

**GRN Construction:**
```
pathPattern: /api/realm/:tenantId/accounts/:id
             ↓
GRN pattern: grn:global:iam-system::${tenantId}:accounts/*
             ↓
GRN example: grn:global:iam-system::tenant-123:accounts/acc-456
```

### How it helps Policy creation

When a user wants to create a policy, they can:

1. **Query the Application** to see available actions
2. **See the pathPattern** to understand URL structure
3. **Construct GRN** based on the pattern

**Example Flow:**

```typescript
// 1. User queries IAM System application
GET /api/realm/tenant-123/applications?systemId=iam-system

// 2. Response shows availableActions with pathPattern
{
  "availableActions": [
    {
      "resourceType": "realm.accounts",
      "pathPattern": "/api/realm/:tenantId/accounts/:id",
      "operations": ["create", "read", "update", "delete"]
    }
  ]
}

// 3. User creates policy using the pattern
POST /api/realm/tenant-123/policies
{
  "name": "AccountsFullAccess",
  "effect": "Allow",
  "actions": ["iam-system:realm.accounts:*"],
  "resources": ["grn:global:iam-system::${tenantId}:accounts/*"]
}
```

## Authorization Flow

### Complete Authorization Example

```
Request: GET /api/realm/tenant-123/accounts/acc-456
                    ↓
Authorization Middleware constructs:
  - action: "iam-system:realm.accounts:read"
  - resource: "grn:global:iam-system::tenant-123:accounts/acc-456"
                    ↓
Compares with Policy of the user:
  - actions: ["iam-system:realm.accounts:*"]
  - resources: ["grn:global:iam-system::tenant-123:accounts/*"]
                    ↓
Match? → ALLOW or DENY
```

### Runtime GRN Construction

During a request, the authorization middleware constructs the GRN dynamically:

```typescript
// Request
GET /api/realm/tenant-123/accounts/acc-456

// Middleware constructs GRN
const grn = buildGRN(ctx, config);
// Result: grn:global:iam-system::tenant-123:accounts/acc-456

// Compares with Policy
Policy resource: grn:global:iam-system::${tenantId}:accounts/*
Request GRN:     grn:global:iam-system::tenant-123:accounts/acc-456
Match: ✓ ALLOW
```

### buildGRN Function

```typescript
const buildGRN = (ctx: Context, config: AuthorizationConfig): string => {
  const { tenantId } = ctx.params;
  const systemId = config.systemId ?? 'iam-system';
  
  // Extract resource-path from pathPattern and params
  // pathPattern: /api/realm/:tenantId/accounts/:id
  // params: { tenantId: 'tenant-123', id: 'acc-456' }
  // resourcePath: 'accounts/acc-456'
  const resourcePath = extractResourcePath(ctx.state.pathPattern, ctx.params);
  
  return `grn:global:${systemId}::${tenantId}:${resourcePath}`;
};
```

## Key Points

1. **Application.availableActions.pathPattern** is for **documentation and policy creation**
2. **Authorization middleware** constructs GRN **dynamically at runtime**
3. **No database lookup** needed during authorization - middleware has all info in `ctx`
4. **pathPattern** helps users understand URL structure when writing policies

## Summary

- **Applications** register what actions they support
- **pathPattern** shows the URL structure for each resource
- **Users** use pathPattern to construct correct GRN patterns in policies
- **Middleware** constructs GRN dynamically from request context
- **Policies** define what resources users can access using GRN patterns
