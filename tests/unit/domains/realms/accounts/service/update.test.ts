import {
  createTestEmail,
  generateTestEmail,
  TEST_PASSWORD,
} from '@test/utils/test-constants';
import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.update', () => {
  it('should throw NotFoundError when account not found', async () => {
    const tenantId = await getTenantId('test-account-update');
    const nonExistentId = uuidv4();

    await expect(
      accountService.update(tenantId, nonExistentId, { someField: 'value' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should return account when update with empty data', async () => {
    const tenantId = await getTenantId('test-account-update-2');
    const email = generateTestEmail('test'); // Test credential - not production;

    const createdAccount = await accountService.create(tenantId, {
      email,
      password: TEST_PASSWORD, // Test credential - not production,
    });

    const updatedAccount = await accountService.update(
      tenantId,
      createdAccount._id,
      {} // Update vazio
    );

    expect(updatedAccount).toHaveProperty('_id', createdAccount._id);
    expect(updatedAccount.emails[0].email).toBe(email);
  });

  it('should exclude email and password from update', async () => {
    const tenantId = await getTenantId('test-account-update-3');
    const email = generateTestEmail('test'); // Test credential - not production;

    const createdAccount = await accountService.create(tenantId, {
      email,
      password: TEST_PASSWORD, // Test credential - not production,
    });

    const updatedAccount = await accountService.update(
      tenantId,
      createdAccount._id,
      {
        email: createTestEmail('should-be-ignored'), // Test credential - not production
        password: 'should-be-ignored',
      }
    );

    expect(updatedAccount.emails[0].email).toBe(email); // Original email preserved
  });
});
