import {
  createTestEmail,
  generateTestEmail,
  TEST_PASSWORD,
} from '@test/utils/test-constants';
import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import { ValidationError } from '@/errors/validation';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';

describe('account.service.removeEmail', () => {
  it('should throw ValidationError when trying to remove the only email', async () => {
    const tenantId = await getTenantId('vi-test-db-remove-only-email');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('only-email'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production,
    });

    const primaryEmail = account.emails[0].email;

    await expect(
      accountService.removeEmail(tenantId, account._id, primaryEmail)
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError when email does not exist in account', async () => {
    const tenantId = await getTenantId('vi-test-db-remove-nonexistent-email');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('main'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production,
    });

    await accountService.addEmail(
      tenantId,
      account._id,
      generateTestEmail('second') // Test credential - not production
    );

    await expect(
      accountService.removeEmail(
        tenantId,
        account._id,
        createTestEmail('nonexistent') // Test credential - not production
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should remove email successfully', async () => {
    const tenantId = await getTenantId('vi-test-db-remove-email-success');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('main'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production,
    });

    const secondEmail = generateTestEmail('second'); // Test credential - not production;
    await accountService.addEmail(tenantId, account._id, secondEmail);

    const updatedAccount = await accountService.removeEmail(
      tenantId,
      account._id,
      secondEmail
    );

    expect(updatedAccount.emails.length).toBe(1);
    expect(updatedAccount.emails.some((e) => e.email === secondEmail)).toBe(
      false
    );
  });

  it('should throw NotFoundError when account deleted after validation', async () => {
    const tenantId = await getTenantId(
      'vi-test-db-remove-email-not-found-after'
    );

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('remove-email'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production,
    });

    const secondEmail = generateTestEmail('second'); // Test credential - not production;
    await accountService.addEmail(tenantId, account._id, secondEmail);
    await accountService.remove(tenantId, account._id);

    await expect(
      accountService.removeEmail(tenantId, account._id, secondEmail)
    ).rejects.toThrow(NotFoundError);
  });
});
