import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import {
  generateTestEmail,
  createTestEmail,
  TEST_PASSWORD,
} from '@test/utils/test-constants';

describe('account.service.setPrimaryEmail', () => {
  it('should throw NotFoundError when email does not exist in account', async () => {
    const tenantId = await getTenantId('test-set-primary-nonexistent');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('main'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    await expect(
      accountService.setPrimaryEmail(
        tenantId,
        account._id,
        createTestEmail('nonexistent') // Test credential - not production
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should set primary email successfully', async () => {
    const tenantId = await getTenantId('test-set-primary-success');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('main'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    const secondEmail = generateTestEmail('second'); // Test credential - not production
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
    const email1 = generateTestEmail('primary1'); // Test credential - not production
    const email2 = generateTestEmail('primary2'); // Test credential - not production

    const account = await accountService.create(tenantId, {
      email: email1,
      password: TEST_PASSWORD, // Test credential - not production
    });

    await accountService.addEmail(tenantId, account._id, email2);
    await accountService.remove(tenantId, account._id);

    await expect(
      accountService.setPrimaryEmail(tenantId, account._id, email2)
    ).rejects.toThrow(NotFoundError);
  });
});
