import { describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as validationService from '@/domains/commons/validations/validation.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.addEmail', () => {
  it('should throw NotFoundError when account not found', async () => {
    const tenantId = await getTenantId('test-account-addemail');
    const nonExistentId = uuidv4();
    const email = `test-${uuidv4()}@example.com`;

    await expect(
      accountService.addEmail(tenantId, nonExistentId, email)
    ).rejects.toThrow(NotFoundError);
  });

  it('should add email successfully', async () => {
    const tenantId = await getTenantId('test-account-addemail-2');
    const primaryEmail = `primary-${uuidv4()}@example.com`;
    const secondaryEmail = `secondary-${uuidv4()}@example.com`;

    const createdAccount = await accountService.create(tenantId, {
      email: primaryEmail,
      password: 'Password123!',
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
    const email = `test-${uuidv4()}@example.com`;

    const createdAccount = await accountService.create(tenantId, {
      email,
      password: 'Password123!',
    });

    await expect(
      accountService.addEmail(tenantId, createdAccount._id, email)
    ).rejects.toThrow();
  });

  it('should throw NotFoundError when account deleted after validation', async () => {
    const tenantId = await getTenantId('test-add-email-not-found-after');

    const account = await accountService.create(tenantId, {
      email: `add-email-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    await accountService.remove(tenantId, account._id);

    await expect(
      accountService.addEmail(
        tenantId,
        account._id,
        `new-${uuidv4()}@example.com`
      )
    ).rejects.toThrow(NotFoundError);
  });

  it('should handle addEmail with duplicate email validation', async () => {
    const tenantId = await getTenantId('test-add-email-duplicate-validation');
    const primaryEmail = `primary-${uuidv4()}@example.com`;
    const secondaryEmail = `secondary-${uuidv4()}@example.com`;
    
    const account = await accountService.create(tenantId, {
      email: primaryEmail,
      password: 'Password123!',
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
