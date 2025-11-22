import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.findById', () => {
  it('should throw NotFoundError when account not found', async () => {
    const tenantId = await getTenantId('vi-test-db-account-findbyid');
    const nonExistentId = uuidv4();

    await expect(
      accountService.findById(tenantId, nonExistentId)
    ).rejects.toThrow(NotFoundError);
  });

  it('should return account when found', async () => {
    const tenantId = await getTenantId('vi-test-db-account-findbyid-success');
    const email = generateTestEmail('test'); // Test credential - not production;

    const createdAccount = await accountService.create(tenantId, {
      email,
      password: TEST_PASSWORD, // Test credential - not production
    });

    const foundAccount = await accountService.findById(
      tenantId,
      createdAccount._id
    );

    expect(foundAccount).toHaveProperty('_id', createdAccount._id);
    expect(foundAccount.emails[0].email).toBe(email);
  });
});
