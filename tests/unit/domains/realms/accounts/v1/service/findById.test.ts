import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.findById', () => {
  it('should throw NotFoundError when account not found', async () => {
    const tenantId = await getTenantId('test-account-findbyid');
    const nonExistentId = uuidv4();

    await expect(
      accountService.findById(tenantId, nonExistentId)
    ).rejects.toThrow(NotFoundError);
  });

  it('should return account when found', async () => {
    const tenantId = await getTenantId('test-account-findbyid-success');
    const email = `test-${uuidv4()}@example.com`;
    
    const createdAccount = await accountService.create(tenantId, {
      email,
      password: 'Password123!',
    });

    const foundAccount = await accountService.findById(tenantId, createdAccount._id);

    expect(foundAccount).toHaveProperty('_id', createdAccount._id);
    expect(foundAccount.emails[0].email).toBe(email);
  });
});