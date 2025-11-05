import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.updatePassword', () => {
  it('should throw NotFoundError when current password is incorrect', async () => {
    const tenantId = await getTenantId('test-update-password-wrong-current');
    
    // Criar conta
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
    
    // Criar conta
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
});