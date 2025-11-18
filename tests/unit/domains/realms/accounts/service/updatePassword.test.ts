import { describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getModel } from '@/domains/realms/accounts/account.model';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getTenantId } from '@test/utils/tenant.util';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('account.service.updatePassword', () => {
  it('should throw NotFoundError when current password is incorrect', async () => {
    const tenantId = await getTenantId('test-update-password-wrong-current');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('update-pwd'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    await expect(
      accountService.updatePassword(
        tenantId,
        account._id,
        'WrongPassword123!',
        TEST_PASSWORD
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should update password successfully', async () => {
    const tenantId = await getTenantId('test-update-password-success');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('update-pwd-success'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    const updatedAccount = await accountService.updatePassword(
      tenantId,
      account._id,
      TEST_PASSWORD,
      'NewPassword456!'
    );

    expect(updatedAccount._id).toBe(account._id);
    expect(updatedAccount.password).toBeDefined();
  });

  it('should throw NotFoundError when account deleted between validation and update', async () => {
    const tenantId = await getTenantId('test-update-password-race-condition');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('race'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    await accountService.remove(tenantId, account._id);

    await expect(
      accountService.updatePassword(
        tenantId,
        account._id,
        TEST_PASSWORD,
        'NewPassword789!'
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should handle updatePassword save error', async () => {
    const tenantId = await getTenantId('test-update-password-save-error');
    const dbName = await getDBName({ publicUUID: tenantId });

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('update-save-error'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    const AccountModel = getModel(dbName);
    const saveSpy = vi.spyOn(AccountModel.prototype, 'save');
    saveSpy.mockRejectedValue(new Error('Database save error'));

    try {
      await expect(
        accountService.updatePassword(
          tenantId,
          account._id,
          TEST_PASSWORD, // Test credential - not production
          'NewPassword999!'
        )
      ).rejects.toThrow('Database save error');
    } finally {
      saveSpy.mockRestore();
    }
  });
});
