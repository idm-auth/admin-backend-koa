import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.setPrimaryEmail race condition', () => {
  it('should throw NotFoundError when account deleted after validation', async () => {
    const tenantId = await getTenantId('test-set-primary-race');
    const email1 = `primary1-${uuidv4()}@example.com`;
    const email2 = `primary2-${uuidv4()}@example.com`;

    const account = await accountService.create(tenantId, {
      email: email1,
      password: 'Password123!',
    });

    await accountService.addEmail(tenantId, account._id, email2);
    await accountService.remove(tenantId, account._id);

    await expect(
      accountService.setPrimaryEmail(tenantId, account._id, email2)
    ).rejects.toThrow(NotFoundError);
  });
});
