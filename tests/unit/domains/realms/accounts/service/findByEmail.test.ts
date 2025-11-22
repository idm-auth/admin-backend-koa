import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('account.service.findByEmail', () => {
  it('should throw NotFoundError when email not found', async () => {
    const tenantId = await getTenantId('vi-test-db-account-findbyemail');
    const nonExistentEmail = generateTestEmail('non-existent'); // Test credential - not production

    await expect(
      accountService.findByEmail(tenantId, nonExistentEmail)
    ).rejects.toThrow(NotFoundError);
  });

  it('should return account when found by email', async () => {
    const tenantId = await getTenantId('vi-test-db-account-findbyemail-2');
    const email = generateTestEmail('test'); // Test credential - not production

    const createdAccount = await accountService.create(tenantId, {
      email,
      password: TEST_PASSWORD, // Test credential - not production
    });

    const foundAccount = await accountService.findByEmail(tenantId, email);

    expect(foundAccount).toHaveProperty('_id', createdAccount._id);
    expect(foundAccount.emails[0].email).toBe(email);
  });
});
