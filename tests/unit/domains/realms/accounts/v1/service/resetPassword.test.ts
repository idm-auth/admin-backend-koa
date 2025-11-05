import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
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
      email: `reset-${uuidv4()}@example.com`,
      password: 'OldPassword123!',
    });

    const newPassword = 'NewPassword123!';
    const updatedAccount = await accountService.resetPassword(
      tenantId,
      account._id,
      newPassword
    );

    expect(updatedAccount._id).toBe(account._id);
    expect(updatedAccount.password).toBeDefined();
  });

  it('should handle validation error and throw ZodError', async () => {
    const tenantId = await getTenantId('test-reset-password-validation-error');

    const account = await accountService.create(tenantId, {
      email: `reset-validation-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    await expect(
      accountService.resetPassword(tenantId, account._id, '')
    ).rejects.toThrow();
  });

  it('should handle invalid password format', async () => {
    const tenantId = await getTenantId('test-reset-password-invalid-format');

    const account = await accountService.create(tenantId, {
      email: `reset-invalid-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    await expect(
      accountService.resetPassword(tenantId, account._id, 'weak')
    ).rejects.toThrow();
  });
});
