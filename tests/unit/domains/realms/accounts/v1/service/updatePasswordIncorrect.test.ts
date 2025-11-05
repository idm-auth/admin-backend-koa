import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.updatePassword incorrect password', () => {
  it('should throw NotFoundError for incorrect current password', async () => {
    const tenantId = await getTenantId('test-update-password-incorrect');
    
    const account = await accountService.create(tenantId, {
      email: `update-password-${uuidv4()}@example.com`,
      password: 'CorrectPassword123!',
    });

    await expect(
      accountService.updatePassword(tenantId, account._id, 'WrongPassword123!', 'NewPassword123!')
    ).rejects.toThrow(NotFoundError);
  });
});