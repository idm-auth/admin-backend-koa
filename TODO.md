# System Setup Implementation TODO

## Overview
Complete the implementation of `initSetup()` and `repairSetup()` methods in both core and realm system-setup services.

---

## Core System Setup Service
**File:** `src/domain/core/system-setup/system-setup.service.ts`

### ✅ initSetup() - COMPLETED
Creates only what's impossible to exist (core realm + admin account), then delegates to repairSetup.

**What it creates (only if doesn't exist):**
- Core realm (via `RealmService.ensureCoreRealmExists()`)
- Initial admin account (via `AccountService.createFromDto()`)
- Admin account → admin group link (via `AccountGroupService.create()`)

**Flow:**
1. Ensure core realm exists → get publicUUID
2. Set execution context to core realm
3. Check if setup already completed → return 200 if yes
4. Call `repairSetup()` to create/repair everything else
5. Create admin account
6. Create admin account → admin group link
7. Return 201

### ❌ repairSetup() - TODO
Creates or repairs all setup components (idempotent, handles migrations and accidental deletions).

**What it does (upsert approach):**
- Ensures realm setup record exists with valid JWT config (upsert)
- Ensures admin group exists (upsert)
- Ensures admin policy exists (upsert)
- Ensures admin group is linked to admin policy (upsert)
- Ensures API application exists with valid config (upsert)
- Ensures Web Admin application exists with valid config (upsert)
- Ensures core setup record exists with valid JWT config (upsert)
- Updates lastRepairAt timestamp on core setup record

**Flow:**
1. Get core realm (throws if missing)
2. Set execution context to core realm
3. Call `RealmSystemSetupService.repairSetup()` to repair realm setup
4. Find or create admin group via `GroupService`
5. Find or create admin policy via `PolicyService`
6. Find or create admin group → admin policy link via `GroupPolicyService`
7. Upsert API application via `ApplicationService.upsertIdmAuthCoreAPIApplication()`
8. Upsert API application config via `ApplicationConfigurationService.upsertIdmAuthCoreAPIConfig()`
9. Upsert Web Admin application via `ApplicationService.upsertIdmAuthCoreWebAdminApplication()`
10. Upsert Web Admin application config via `ApplicationConfigurationService.upsertIdmAuthCoreWebAdminConfig()`
11. Upsert core setup record with lastRepairAt timestamp
12. Log repair completion
13. Return 200

**Error Handling:**
- Throws NotFoundError if core realm doesn't exist (fail-fast)
- All upserts create or update as needed (no errors on missing data)
- Exceptions propagate to controller layer

**Note on Upsert Logic:**
- GroupService, PolicyService, GroupPolicyService don't have built-in upsert methods
- Need to implement upsert pattern: try find → if not found, create; if found, update
- Or add upsert methods to these services if needed

---

## Realm System Setup Service
**File:** `src/domain/realm/system-setup/system-setup.service.ts`

### ✅ repairSetup() - COMPLETED
Creates or repairs realm-level setup state (idempotent).

**What it does:**
- Upsert singleton setup record with lastRepairAt timestamp
- Log repair completion
- Return 200

---

## Key Separation

### initSetup() - Bootstrap Phase
- **Creates:** Core realm, admin account, admin account → group link
- **Delegates:** Everything else to repairSetup()
- **Idempotency:** Check if already completed, return 200 if yes
- **Error Handling:** Throw if core realm can't be created
- **Use Case:** First-time system initialization
- **Why minimal:** Core realm and admin account cannot be recovered if deleted
- **Order:** repairSetup() runs BEFORE admin account creation

### repairSetup() - Maintenance Phase
- **Creates/Updates:** Realm setup, admin group, admin policy, group → policy link, applications, configurations, core setup
- **Idempotency:** Always safe to call multiple times
- **Error Handling:** Throw only if core realm missing (can't repair without it)
- **Use Case:** After migrations, data corruption, manual fixes, or accidental deletions
- **Called by:** initSetup() before creating admin account
- **Why comprehensive:** Everything except core realm, admin account, and account → group link can be recovered

---

## Data Flow

### initSetup() Flow
```
Core Service initSetup()
  ├─ RealmService.ensureCoreRealmExists()
  │   └─ Creates core realm if needed
  ├─ ExecutionContext.setTenantId(coreRealmPublicUUID)
  ├─ Check if setup already completed → return 200 if yes
  ├─ repairSetup()
  │   └─ Creates/repairs realm setup, admin group, admin policy, applications, etc.
  ├─ AccountService.createFromDto(adminAccount)
  │   └─ Returns admin account with _id
  ├─ AccountGroupService.create({ accountId, groupId })
  │   └─ Links admin account to admin group
  └─ Return 201
```

### repairSetup() Flow
```
Core Service repairSetup()
  ├─ RealmService.getRealmCore() → throws if missing
  ├─ ExecutionContext.setTenantId(coreRealmPublicUUID)
  ├─ RealmSystemSetupService.repairSetup()
  │   └─ Realm Service upserts realm setup record
  ├─ GroupService: find or create admin group
  │   └─ Try findOne({ name: 'admin' }) → if not found, create
  ├─ PolicyService: find or create admin policy
  │   └─ Try findOne({ name: 'admin-policy' }) → if not found, create
  ├─ GroupPolicyService: find or create group → policy link
  │   └─ Try findOne({ groupId, policyId }) → if not found, create
  ├─ ApplicationService.upsertIdmAuthCoreAPIApplication()
  ├─ ApplicationConfigurationService.upsertIdmAuthCoreAPIConfig()
  ├─ ApplicationService.upsertIdmAuthCoreWebAdminApplication()
  ├─ ApplicationConfigurationService.upsertIdmAuthCoreWebAdminConfig()
  ├─ Core Repository.upsert(setupKey: 'singleton', { lastRepairAt: new Date() })
  └─ Return 200
```

---

## Implementation Checklist

### Core repairSetup() Implementation
- [ ] Add @TraceAsync decorator
- [ ] Get core realm via `RealmService.getRealmCore()` (throws if missing)
- [ ] Set execution context to core realm publicUUID
- [ ] Call `RealmSystemSetupService.repairSetup()`
- [ ] Find or create admin group via `GroupService`
- [ ] Find or create admin policy via `PolicyService`
- [ ] Find or create admin group → policy link via `GroupPolicyService`
- [ ] Upsert API application via `ApplicationService.upsertIdmAuthCoreAPIApplication()`
- [ ] Upsert API application config via `ApplicationConfigurationService.upsertIdmAuthCoreAPIConfig()`
- [ ] Upsert Web Admin application via `ApplicationService.upsertIdmAuthCoreWebAdminApplication()`
- [ ] Upsert Web Admin application config via `ApplicationConfigurationService.upsertIdmAuthCoreWebAdminConfig()`
- [ ] Upsert core setup record with lastRepairAt timestamp
- [ ] Add logging at key points
- [ ] Return status 200

---

## Available Methods

### RealmService
- `getRealmCore()` - Get core realm, throws NotFoundError if not found
- `ensureCoreRealmExists()` - Get or create core realm, returns publicUUID

### ApplicationService
- `upsertIdmAuthCoreAPIApplication()` - Create or update API application
- `upsertIdmAuthCoreWebAdminApplication()` - Create or update Web Admin application

### ApplicationConfigurationService
- `upsertIdmAuthCoreAPIConfig(applicationId)` - Create or update API config
- `upsertIdmAuthCoreWebAdminConfig(applicationId)` - Create or update Web Admin config

### AccountService
- `findByEmail(email)` - Find account by email, throws NotFoundError if not found
- `createFromDto(dto)` - Create account from DTO

### GroupService
- `create(data)` - Create group, returns GroupEntity
- `findOne(filter)` - Find group by filter, throws NotFoundError if not found

### PolicyService
- `create(data)` - Create policy, returns PolicyEntity
- `findOne(filter)` - Find policy by filter, throws NotFoundError if not found

### AccountGroupService
- `create(data)` - Create account-group link, returns AccountGroupEntity

### GroupPolicyService
- `create(data)` - Create group-policy link, returns GroupPolicyEntity
- `findOne(filter)` - Find link by filter, throws NotFoundError if not found

### RealmSystemSetupService
- `repairSetup()` - Repair realm setup, returns { status: 200 }

### Core SystemSetupRepository
- `upsert(filter, data)` - Create or update setup record

---

## Admin Setup Details

### Admin Group
- **Find Filter:** `{ name: 'admin' }`
- **Create Data:** `{ name: 'admin', description: 'Admin group for system administration' }`

### Admin Policy
- **Find Filter:** `{ name: 'admin-policy' }`
- **Create Data:** `{ name: 'admin-policy', description: 'Admin policy with full permissions', effect: 'Allow', version: '2025-12-24' }`

### Admin Group → Policy Link
- **Find Filter:** `{ groupId, policyId }`
- **Create Data:** `{ groupId, policyId }`

### Admin Account → Group Link (initSetup only)
- **Create Data:** `{ accountId, groupId }`

---

## Upsert Pattern Implementation

For services without built-in upsert, use this pattern:

```typescript
// Find or create pattern
try {
  const existing = await service.findOne(filter);
  // If found, optionally update if needed
  return existing;
} catch (error) {
  if (error instanceof NotFoundError) {
    return await service.create(data);
  }
  throw error;
}
```

---

## Environment Variables

- `IDM_AUTH_CORE_API_SYSTEM_ID` - API application system ID (default: 'idm-auth-core-api')
- `IDM_AUTH_CORE_WEB_ADMIN_SYSTEM_ID` - Web Admin application system ID (default: 'idm-auth-core-web-admin')
- `NODE_ENV` - Environment name (development, production, etc.)
- `MONGODB_CORE_DBNAME` - Core database name
