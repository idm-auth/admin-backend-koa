import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.setPrimaryEmail', () => {
  it('should throw NotFoundError when email does not exist in account', async () => {
    const tenantId = await getTenantId('test-set-primary-nonexistent');

    const account = await accountService.create(tenantId, {
      email: `main-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    await expect(
      accountService.setPrimaryEmail(
        tenantId,
        account._id,
        'nonexistent@example.com'
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should set primary email successfully', async () => {
    const tenantId = await getTenantId('test-set-primary-success');

    const account = await accountService.create(tenantId, {
      email: `main-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    const secondEmail = `second-${uuidv4()}@example.com`;
    await accountService.addEmail(tenantId, account._id, secondEmail);

    const updatedAccount = await accountService.setPrimaryEmail(
      tenantId,
      account._id,
      secondEmail
    );

    const primaryEmail = updatedAccount.emails.find((e) => e.isPrimary);
    expect(primaryEmail?.email).toBe(secondEmail);

    const originalEmail = updatedAccount.emails.find(
      (e) => e.email === account.emails[0].email
    );
    expect(originalEmail?.isPrimary).toBe(false);
  });

  it('should throw NotFoundError when account deleted between validation and update', async () => {
    const tenantId = await getTenantId('test-set-primary-race-condition');
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
