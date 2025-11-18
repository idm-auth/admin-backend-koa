import { describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as validationService from '@/domains/commons/validations/validation.service';
import { getTenantId } from '@test/utils/tenant.util';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.addEmail', () => {
  it('should throw NotFoundError when account not found', async () => {
    const tenantId = await getTenantId('test-account-addemail');
    const nonExistentId = uuidv4();
    const email = generateTestEmail('test'); // Test credential - not production

    await expect(
      accountService.addEmail(tenantId, nonExistentId, email)
    ).rejects.toThrow(NotFoundError);
  });

  it('should add email successfully', async () => {
    const tenantId = await getTenantId('test-account-addemail-2');
    const primaryEmail = generateTestEmail('primary'); // Test credential - not production
    const secondaryEmail = generateTestEmail('secondary'); // Test credential - not production

    const createdAccount = await accountService.create(tenantId, {
      email: primaryEmail,
      password: TEST_PASSWORD, // Test credential - not production
    });

    const updatedAccount = await accountService.addEmail(
      tenantId,
      createdAccount._id,
      secondaryEmail
    );

    expect(updatedAccount.emails).toHaveLength(2);
    expect(updatedAccount.emails.some((e) => e.email === secondaryEmail)).toBe(
      true
    );
    expect(
      updatedAccount.emails.find((e) => e.email === secondaryEmail)?.isPrimary
    ).toBe(false);
  });

  it('should throw error for duplicate email in same account', async () => {
    const tenantId = await getTenantId('test-account-addemail-3');
    const email = generateTestEmail('test'); // Test credential - not production

    const createdAccount = await accountService.create(tenantId, {
      email,
      password: TEST_PASSWORD, // Test credential - not production
    });

    await expect(
      accountService.addEmail(tenantId, createdAccount._id, email)
    ).rejects.toThrow();
  });

  it('should throw NotFoundError when account deleted after validation', async () => {
    const tenantId = await getTenantId('test-add-email-not-found-after');

    const account = await accountService.create(tenantId, {
      email: generateTestEmail('add-email'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    await accountService.remove(tenantId, account._id);

    await expect(
      accountService.addEmail(
        tenantId,
        account._id,
        generateTestEmail('new') // Test credential - not production
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should handle addEmail with duplicate email validation', async () => {
    const tenantId = await getTenantId('test-add-email-duplicate-validation');
    const primaryEmail = generateTestEmail('primary'); // Test credential - not production
    const secondaryEmail = generateTestEmail('secondary'); // Test credential - not production

    const account = await accountService.create(tenantId, {
      email: primaryEmail,
      password: TEST_PASSWORD, // Test credential - not production
    });

    await accountService.addEmail(tenantId, account._id, secondaryEmail);

    const validateSpy = vi.spyOn(validationService, 'validateEmailUnique');
    validateSpy.mockResolvedValue();

    try {
      await expect(
        accountService.addEmail(tenantId, account._id, secondaryEmail)
      ).rejects.toThrow('Email already exists in this account');
    } finally {
      validateSpy.mockRestore();
    }
  });
});
