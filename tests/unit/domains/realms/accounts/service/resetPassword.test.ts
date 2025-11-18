import { describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getModel } from '@/domains/realms/accounts/account.model';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getTenantId } from '@test/utils/tenant.util';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.resetPassword', () => {
  it('should throw NotFoundError when account does not exist', async () => {
    const tenantId = await getTenantId('test-reset-password-not-found');
    const nonExistentId = uuidv4();
    const newPassword = 'NewPassword123!';

    await expect(
      accountService.resetPassword(tenantId, nonExistentId, newPassword)
    ).rejects.toThrow(NotFoundError);
  });

  it('should reset password successfully', async () => {
    const tenantId = await getTenantId('test-reset-password-success');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('reset'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    const newPassword = 'NewPassword456!';
    const updatedAccount = await accountService.resetPassword(
      tenantId,
      account._id,
      newPassword
    );

    expect(updatedAccount._id).toBe(account._id);
    expect(updatedAccount.password).toBeDefined();
    expect(updatedAccount.password).not.toBe(account.password);
  });

  it('should handle validation error and throw ZodError', async () => {
    const tenantId = await getTenantId('test-reset-password-validation-error');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('reset-validation'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    await expect(
      accountService.resetPassword(tenantId, account._id, '')
    ).rejects.toThrow();
  });

  it('should handle invalid password format', async () => {
    const tenantId = await getTenantId('test-reset-password-invalid-format');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('reset-invalid'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    await expect(
      accountService.resetPassword(tenantId, account._id, 'weak')
    ).rejects.toThrow();
  });

  it('should handle resetPassword save error', async () => {
    const tenantId = await getTenantId('test-reset-password-save-error');
    const dbName = await getDBName({ publicUUID: tenantId });

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('reset-save-error'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    const AccountModel = getModel(dbName);
    const saveSpy = vi.spyOn(AccountModel.prototype, 'save');
    saveSpy.mockRejectedValue(new Error('Database save error'));

    try {
      await expect(
        accountService.resetPassword(
          tenantId,
          account._id,
          'NewPassword789!'
        )
      ).rejects.toThrow('Database save error');
    } finally {
      saveSpy.mockRestore();
    }
  });
});
