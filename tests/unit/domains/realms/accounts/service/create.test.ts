import { describe, expect, it } from 'vitest';
import { ValidationError } from '@/errors/validation';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { TEST_PASSWORD, generateTestEmail } from '@test/utils/test-constants';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.create', () => {
  it('should throw ValidationError for duplicate email', async () => {
    const tenantId = await getTenantId('test-account-create-duplicate');
    const email = generateTestEmail('test', uuidv4()); // Test email - not production

    await accountService.create(tenantId, {
      email,
      password: TEST_PASSWORD, // Test credential - not production
    });

    await expect(
      accountService.create(tenantId, {
        email,
        password: TEST_PASSWORD, // Test credential - not production
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should create account successfully', async () => {
    const tenantId = await getTenantId('test-account-create-success');
    const email = generateTestEmail('test', uuidv4()); // Test email - not production

    const account = await accountService.create(tenantId, {
      email,
      password: TEST_PASSWORD, // Test credential - not production
    });

    expect(account).toHaveProperty('_id');
    expect(account.emails[0].email).toBe(email);
    expect(account.emails[0].isPrimary).toBe(true);
  });
});
