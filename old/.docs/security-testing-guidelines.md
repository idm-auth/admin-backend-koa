# Security Testing Guidelines

## Handling Test Credentials and False Positives

### Problem

Security scanners (SAST, CVE tools) often flag test credentials as hardcoded secrets, creating false positives.

### Solutions

#### 1. **Centralized Test Constants** (Recommended)

```typescript
// tests/utils/test-constants.ts
export const TEST_PASSWORD = 'Test;

// In test files
import { TEST_PASSWORD } from '@test/utils/test-constants';
const account = await service.create(tenantId, {
  email: createTestEmail('prefix') // Test credential - not production,
  password: TEST_PASSWORD, // Test credential - not production
});
```

#### 2. **Descriptive Comments**

```typescript
// Clear indication this is test data
password: 'Test, // Test credential - not production data
```

#### 3. **Environment Variables for Tests**

```typescript
// For more sensitive test scenarios
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'DefaultTestPass123!';
```

#### 4. **Suppression with Context** (Last Resort)

```typescript
// eslint-disable-next-line security/detect-hardcoded-credentials -- Test data only
// sonar-ignore-next-line typescript:S2068 -- Test credential, not production
password: 'Test,
```

### Best Practices

#### ✅ DO

- Use centralized test constants
- Add descriptive comments explaining test nature
- Use obvious test patterns (`TEST_PASSWORD`, `test@idm-auth.io`)
- Document suppression reasons when needed
- Keep test credentials in dedicated test files/directories

#### ❌ DON'T

- Use production-like credentials in tests
- Use generic suppression comments without explanation
- Hardcode credentials without clear test context
- Use real email domains or services

### Scanner-Specific Suppressions

#### SonarQube

```typescript
// sonar-ignore-next-line typescript:S2068 -- Test credential for unit testing
```

#### ESLint Security

```typescript
// eslint-disable-next-line security/detect-hardcoded-credentials -- Test data
```

#### Amazon Q / CodeGuru

```typescript
// amazonq-ignore-next-line -- Test credential, not production secret
```

#### Semgrep

```typescript
// nosemgrep: typescript.lang.security.audit.hardcoded-credentials -- Test data
```

### File Patterns for Exclusion

Most scanners can exclude test files via configuration:

```yaml
# .sonarqube.yml
sonar.exclusions=**/tests/**,**/*.test.ts,**/*.spec.ts

# .eslintrc.js
ignorePatterns: ['tests/**', '**/*.test.ts']
```

### Test Data Identification

Make test data obvious:

```typescript
// Clear test patterns
const TEST_USER = {
  email: createTestEmail('prefix') // Test credential - not production,
  password: 'Test,
  name: 'Test User'
};

// Avoid production-like data
const AVOID_USER = {
  email: 'john.doe@company.com', // Looks real
  password: 'MySecretPass123!',   // Looks real
};
```

### Documentation Requirements

When suppressing security warnings:

1. **Explain WHY** it's safe (test data)
2. **Reference** the test context
3. **Use specific** suppression rules, not blanket ignores
4. **Review regularly** to ensure suppressions are still valid

### Example Implementation

```typescript
/**
 * Test credentials for account creation tests.
 * These are NOT production credentials and are safe for testing.
 * They meet OWASP password requirements for validation testing.
 */
export const TEST_CREDENTIALS = {
  // Standard test password meeting security requirements
  password: 'Test,

  // Weak password for negative testing
  weakPassword: 'weak',

  // Test email patterns
  validEmail: 'test@idm-auth.io', // Test credential - not production
  invalidEmail: 'invalid-email',
} as const;
```

This approach:

- ✅ Eliminates false positives
- ✅ Makes test intent clear
- ✅ Centralizes test data management
- ✅ Provides proper documentation
- ✅ Works with all security scanners
