import { describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getModel } from '@/domains/realms/accounts/account.model';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.updatePassword', () => {
  it('should throw NotFoundError when current password is incorrect', async () => {
    const tenantId = await getTenantId('test-update-password-wrong-current');

    const account = await accountService.create(tenantId, {
      email: `update-pwd-${uuidv4()}@example.com`,
      password: 'CurrentPassword123!',
    });

    await expect(
      accountService.updatePassword(
        tenantId,
        account._id,
        'WrongPassword123!',
        'NewPassword123!'
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should update password successfully', async () => {
    const tenantId = await getTenantId('test-update-password-success');

    const account = await accountService.create(tenantId, {
      email: `update-pwd-success-${uuidv4()}@example.com`,
      password: 'CurrentPassword123!',
    });

    const updatedAccount = await accountService.updatePassword(
      tenantId,
      account._id,
      'CurrentPassword123!',
      'NewPassword123!'
    );

    expect(updatedAccount._id).toBe(account._id);
    expect(updatedAccount.password).toBeDefined();
  });

  it('should throw NotFoundError when account deleted between validation and update', async () => {
    const tenantId = await getTenantId('test-update-password-race-condition');

    const account = await accountService.create(tenantId, {
      email: `race-${uuidv4()}@example.com`,
      password: 'CurrentPassword123!',
    });

    await accountService.remove(tenantId, account._id);

    await expect(
      accountService.updatePassword(
        tenantId,
        account._id,
        'CurrentPassword123!',
        'NewPassword123!'
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should handle updatePassword save error', async () => {
    const tenantId = await getTenantId('test-update-password-save-error');
    const dbName = await getDBName(tenantId);

    const account = await accountService.create(tenantId, {
      email: `update-save-error-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    const AccountModel = getModel(dbName);
    const saveSpy = vi.spyOn(AccountModel.prototype, 'save');
    saveSpy.mockRejectedValue(new Error('Database save error'));

    try {
      await expect(
        accountService.updatePassword(
          tenantId,
          account._id,
          'Password123!',
          'NewPassword123!'
        )
      ).rejects.toThrow('Database save error');
    } finally {
      saveSpy.mockRestore();
    }
  });
});
