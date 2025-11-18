import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountDocument } from '@/domains/realms/accounts/account.model';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.remove', () => {
  it('should throw NotFoundError when account not found', async () => {
    const tenantId = await getTenantId('test-account-remove');
    const nonExistentId = uuidv4();

    await expect(
      accountService.remove(tenantId, nonExistentId)
    ).rejects.toThrow(NotFoundError);
  });

  it('should remove account successfully', async () => {
    const tenantId = await getTenantId('test-account-remove-2');
    const email = generateTestEmail('test'); // Test credential - not production;

    const createdAccount: AccountDocument = await accountService.create(
      tenantId,
      {
        email,
        password: TEST_PASSWORD, // Test credential - not production,
      }
    );

    // Remove should not throw
    await expect(
      accountService.remove(tenantId, createdAccount._id)
    ).resolves.not.toThrow();

    // Account should no longer exist
    await expect(
      accountService.findById(tenantId, createdAccount._id)
    ).rejects.toThrow(NotFoundError);
  });
});
