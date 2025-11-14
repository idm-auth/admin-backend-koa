import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
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
    const email = `test-${uuidv4()}@example.com`;

    const createdAccount = await accountService.create(tenantId, {
      email,
      password: 'Password123!',
    });

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
