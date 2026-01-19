# Authorization Evaluation - Detailed Implementation Plan

## Current State
Stub implementation returning `allowed: true` for testing framework integration.

## Sample Request Log
```
tenantId: 7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5
userToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2Mjc4N2ZjNC1mZDQ3LTRjODUtOTIyYi1hZTMyMmE5NmU5NjkiLCJpYXQiOjE3Njg0MzM5MzQsImV4cCI6MTc2ODQzNDgzNH0.F2ogAwS30vC5xnYXK0-QXcYPA61hg32X1vAUpP8evYY
grn: grn:global:idm-auth-core-api::7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5:applications/*
```

---

## PHASE 1: System Setup - Initial Policies Creation

### Overview
The `SystemSetupService.repairSetup()` method is called via `POST /api/realm/:tenantId/system-setup/repair` endpoint. This is where initial data must be created.

### Current State of repairSetup()
```typescript
@TraceAsync('system-setup.service.repairSetup')
async repairSetup(): Promise<{ status: number }> {
  await this.repository.upsert(
    { setupKey: 'singleton' },
    { setupKey: 'singleton', lastRepairAt: new Date() }
  );
  this.log.info('Realm setup repair completed');
  return { status: 200 };
}
```

**Problem**: Only creates/updates the setup singleton, does NOT create policies, roles, or linkages.

---

### What Needs to Be Done

#### 1.1 Add Service Injections to SystemSetupService

**File**: `/workspace/src/domain/realm/system-setup/system-setup.service.ts`

Add these injections:
```typescript
@inject(PolicyServiceSymbol) private policyService!: PolicyService;
@inject(RoleServiceSymbol) private roleService!: RoleService;
@inject(RolePolicyServiceSymbol) private rolePolicyService!: RolePolicyService;
@inject(AccountRoleServiceSymbol) private accountRoleService!: AccountRoleService;
```

**Imports needed**:
```typescript
import { PolicyService, PolicyServiceSymbol } from '@/domain/realm/policy/policy.service';
import { RoleService, RoleServiceSymbol } from '@/domain/realm/role/role.service';
import { RolePolicyService, RolePolicyServiceSymbol } from '@/domain/realm/role-policy/role-policy.service';
import { AccountRoleService, AccountRoleServiceSymbol } from '@/domain/realm/account-role/account-role.service';
```

---

#### 1.2 Modify repairSetup() to Create Initial Role

**File**: `/workspace/src/domain/realm/system-setup/system-setup.service.ts`

In `repairSetup()` method, after upserting setup singleton:

```typescript
// Create or get ApplicationAdmin role
let role = await this.roleService.repository.findOne({ name: 'ApplicationAdmin' }).catch(() => null);
if (!role) {
  role = await this.roleService.create({
    name: 'ApplicationAdmin',
    description: 'Default admin role for application management',
    permissions: []
  });
  this.log.info({ roleId: role._id }, 'Created ApplicationAdmin role');
}
```

**Why**: 
- Role must exist before linking to policy
- Check if already exists to avoid duplicates on multiple repairs
- Use repository directly to check existence (service.create throws if not found)

---

#### 1.3 Modify repairSetup() to Create Initial Policy

**File**: `/workspace/src/domain/realm/system-setup/system-setup.service.ts`

In `repairSetup()` method, after creating role:

```typescript
// Create or get ApplicationManagement policy
let policy = await this.policyService.repository.findOne({ name: 'ApplicationManagement' }).catch(() => null);
if (!policy) {
  policy = await this.policyService.create({
    name: 'ApplicationManagement',
    version: '2025-12-24',
    effect: 'Allow',
    actions: ['*'],
    resources: ['grn:global:idm-auth-core-api::*:applications/*']
  });
  this.log.info({ policyId: policy._id }, 'Created ApplicationManagement policy');
}
```

**Why**:
- Policy defines what resources can be accessed (applications/*)
- Effect: Allow means this policy grants access
- Actions: ['*'] means all actions are allowed
- Resources: matches the GRN pattern from the request
- Check if already exists to avoid duplicates

---

#### 1.4 Modify repairSetup() to Link Role to Policy

**File**: `/workspace/src/domain/realm/system-setup/system-setup.service.ts`

In `repairSetup()` method, after creating policy:

```typescript
// Link role to policy
const rolePolicy = await this.rolePolicyService.repository
  .findOne({ roleId: role._id.toString(), policyId: policy._id.toString() })
  .catch(() => null);
if (!rolePolicy) {
  await this.rolePolicyService.create({
    roleId: role._id.toString(),
    policyId: policy._id.toString()
  });
  this.log.info({ roleId: role._id, policyId: policy._id }, 'Linked role to policy');
}
```

**Why**:
- RolePolicy is a junction table linking roles to policies
- When account has this role, it inherits all policies linked to that role
- Check if already exists to avoid duplicates

---

#### 1.5 Modify repairSetup() to Link Test Account to Role

**File**: `/workspace/src/domain/realm/system-setup/system-setup.service.ts`

In `repairSetup()` method, after linking role to policy:

```typescript
// Link test account to role
const testAccountId = '62787fc4-fd47-4c85-922b-ae322a96e969';
const accountRole = await this.accountRoleService.repository
  .findOne({ accountId: testAccountId, roleId: role._id.toString() })
  .catch(() => null);
if (!accountRole) {
  await this.accountRoleService.create({
    accountId: testAccountId,
    roleId: role._id.toString()
  });
  this.log.info({ accountId: testAccountId, roleId: role._id }, 'Linked account to role');
}
```

**Why**:
- AccountRole is a junction table linking accounts to roles
- This gives the test account the ApplicationAdmin role
- The test account ID comes from the JWT in the sample request
- Check if already exists to avoid duplicates

---

### Complete repairSetup() Implementation

```typescript
@TraceAsync('system-setup.service.repairSetup')
async repairSetup(): Promise<{ status: number }> {
  // 1. Upsert setup singleton
  await this.repository.upsert(
    { setupKey: 'singleton' },
    { setupKey: 'singleton', lastRepairAt: new Date() }
  );

  // 2. Create or get ApplicationAdmin role
  let role = await this.roleService.repository.findOne({ name: 'ApplicationAdmin' }).catch(() => null);
  if (!role) {
    role = await this.roleService.create({
      name: 'ApplicationAdmin',
      description: 'Default admin role for application management',
      permissions: []
    });
    this.log.info({ roleId: role._id }, 'Created ApplicationAdmin role');
  }

  // 3. Create or get ApplicationManagement policy
  let policy = await this.policyService.repository.findOne({ name: 'ApplicationManagement' }).catch(() => null);
  if (!policy) {
    policy = await this.policyService.create({
      name: 'ApplicationManagement',
      version: '2025-12-24',
      effect: 'Allow',
      actions: ['*'],
      resources: ['grn:global:idm-auth-core-api::*:applications/*']
    });
    this.log.info({ policyId: policy._id }, 'Created ApplicationManagement policy');
  }

  // 4. Link role to policy
  const rolePolicy = await this.rolePolicyService.repository
    .findOne({ roleId: role._id.toString(), policyId: policy._id.toString() })
    .catch(() => null);
  if (!rolePolicy) {
    await this.rolePolicyService.create({
      roleId: role._id.toString(),
      policyId: policy._id.toString()
    });
    this.log.info({ roleId: role._id, policyId: policy._id }, 'Linked role to policy');
  }

  // 5. Link test account to role
  const testAccountId = '62787fc4-fd47-4c85-922b-ae322a96e969';
  const accountRole = await this.accountRoleService.repository
    .findOne({ accountId: testAccountId, roleId: role._id.toString() })
    .catch(() => null);
  if (!accountRole) {
    await this.accountRoleService.create({
      accountId: testAccountId,
      roleId: role._id.toString()
    });
    this.log.info({ accountId: testAccountId, roleId: role._id }, 'Linked account to role');
  }

  this.log.info('Realm setup repair completed with authorization data');
  return { status: 200 };
}
```

---

### How to Test Phase 1

1. Call the repair endpoint:
```bash
POST /api/realm/7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5/system-setup/repair
```

2. Check logs for:
```
Created ApplicationAdmin role
Created ApplicationManagement policy
Linked role to policy
Linked account to role
Realm setup repair completed with authorization data
```

3. Verify data was created:
```bash
GET /api/realm/7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5/role
GET /api/realm/7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5/policy
GET /api/realm/7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5/role-policy
GET /api/realm/7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5/account-role
```

---

## PHASE 2: JWT Token Decoding

### Status: ✅ READY
- JwtService exists with `verifyToken(token)` method
- Extracts JwtPayload with accountId
- Uses SystemSetupService to get JWT secret

### What's Missing:
- **AuthzService needs to inject JwtService** - Currently not injected
- **Error handling for invalid/expired tokens** - Need to catch jwt.verify errors
- **Token validation in evaluate()** - Need to call `jwtService.verifyToken(request.userToken)`

### Implementation:
```typescript
// In AuthzService constructor
@inject(JwtServiceSymbol) private jwtService!: JwtService;

// In evaluate() method
const payload = await this.jwtService.verifyToken(request.userToken);
const accountId = payload.accountId;
```

---

## PHASE 3: GRN Parsing

### Status: ❌ NOT IMPLEMENTED
- GRN format: `grn:global:idm-auth-core-api::tenantId:resource/action`
- Example: `grn:global:idm-auth-core-api::7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5:applications/*`

### What's Missing:
- **GRN parser utility** - Need to create utility to parse GRN format
- **Extract resource path** - From `applications/*` 
- **Extract action** - From `applications/*` (wildcard means all actions)
- **Validate GRN format** - Ensure it matches expected pattern

### Implementation Needed:
```typescript
// Create new file: src/domain/realm/authz/grn.parser.ts
interface ParsedGrn {
  service: string;        // idm-auth-core-api
  tenantId: string;       // 7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5
  resource: string;       // applications/*
}

function parseGrn(grn: string): ParsedGrn {
  // Parse: grn:global:idm-auth-core-api::tenantId:resource
}
```

---

## PHASE 4: Policy Retrieval

### Status: ⚠️ PARTIALLY IMPLEMENTED
- getPoliciesForAccount() method exists but needs custom repository methods
- Fetches policies via: direct, roles, groups, group-roles

### What's Missing:
- **AccountRoleRepository.findByAccountId()** - Not implemented in base class
- **RolePolicyRepository.findByRoleId()** - Not implemented in base class
- **AccountPolicyRepository.findByAccountId()** - Not implemented in base class
- **GroupRoleRepository.findByGroupId()** - Not implemented in base class
- **GroupPolicyRepository.findByGroupId()** - Not implemented in base class

### Implementation Needed:
Each repository needs custom method to find by foreign key:
```typescript
// In AccountRoleRepository
async findByAccountId(accountId: string): Promise<AccountRoleEntity[]> {
  return this.find({ accountId });
}

// In RolePolicyRepository
async findByRoleId(roleId: string): Promise<RolePolicyEntity[]> {
  return this.find({ roleId });
}

// Similar for: AccountPolicyRepository, GroupRoleRepository, GroupPolicyRepository
```

---

## PHASE 5: Policy Evaluation

### Status: ✅ READY
- evaluatePolicies() method exists
- matchAction() and matchResource() with wildcard support
- Explicit Deny check (fail fast)
- Explicit Allow check
- Implicit deny default

### What's Missing:
- **GRN to resource/action conversion** - Need to convert parsed GRN to format for matching
- **Policy resource format alignment** - Ensure policy resources match GRN format

### Implementation:
```typescript
// In evaluate() method
const parsed = parseGrn(request.grn);
const result = this.evaluatePolicies(
  policies,
  '*',  // action from GRN
  parsed.resource,  // resource from GRN
  { tenantId, accountId }
);
```

---

## PHASE 6: Service Injections

### Status: ⚠️ PARTIALLY DONE

### AuthzService Missing:
- **JwtService** - Not injected

### SystemSetupService Missing:
- **PolicyService** - Not injected
- **RoleService** - Not injected
- **RolePolicyService** - Not injected
- **AccountRoleService** - Not injected

### Implementation:
```typescript
// In AuthzService
@inject(JwtServiceSymbol) private jwtService!: JwtService;

// In SystemSetupService
@inject(PolicyServiceSymbol) private policyService!: PolicyService;
@inject(RoleServiceSymbol) private roleService!: RoleService;
@inject(RolePolicyServiceSymbol) private rolePolicyService!: RolePolicyService;
@inject(AccountRoleServiceSymbol) private accountRoleService!: AccountRoleService;
```

---

## Summary of Missing Components

| Component | Status | Priority | Location |
|-----------|--------|----------|----------|
| Initial policies setup | ❌ Not implemented | CRITICAL | SystemSetupService.repairSetup() |
| JWT token decoding | 🟡 Ready, needs injection | HIGH | AuthzService |
| GRN parser utility | ❌ Not implemented | HIGH | New file: grn.parser.ts |
| Repository findBy methods | ❌ Not implemented | HIGH | 5 repositories |
| Policy evaluation logic | ✅ Ready | - | AuthzService |
| Service injections | 🟡 Partial | HIGH | AuthzService + SystemSetupService |

---

## Implementation Order

1. **Add service injections** to SystemSetupService (Policy, Role, RolePolicy, AccountRole services)
2. **Implement initial data creation** in SystemSetupService.repairSetup() (role, policy, linkages)
3. **Add service injections** to AuthzService (JwtService)
4. **Create GRN parser utility** (grn.parser.ts)
5. **Add findBy methods** to all repositories (AccountRole, RolePolicy, AccountPolicy, GroupRole, GroupPolicy)
6. **Implement token decoding** in AuthzService.evaluate()
7. **Implement GRN parsing** in AuthzService.evaluate()
8. **Implement policy retrieval** in AuthzService.getPoliciesForAccount()
9. **End-to-end test** with real authorization flow
