import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import { ValidationError } from '@/errors/validation';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.removeEmail', () => {
  it('should throw ValidationError when trying to remove the only email', async () => {
    const tenantId = await getTenantId('test-remove-only-email');
    
    // Criar conta com apenas um email
    const account = await accountService.create(tenantId, {
      email: `only-email-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    const primaryEmail = account.emails[0].email;

    await expect(
      accountService.removeEmail(tenantId, account._id, primaryEmail)
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError when email does not exist in account', async () => {
    const tenantId = await getTenantId('test-remove-nonexistent-email');
    
    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `main-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    // Adicionar segundo email
    await accountService.addEmail(tenantId, account._id, `second-${uuidv4()}@example.com`);

    await expect(
      accountService.removeEmail(tenantId, account._id, 'nonexistent@example.com')
    ).rejects.toThrow(NotFoundError);
  });

  it('should remove email successfully', async () => {
    const tenantId = await getTenantId('test-remove-email-success');
    
    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `main-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    // Adicionar segundo email
    const secondEmail = `second-${uuidv4()}@example.com`;
    await accountService.addEmail(tenantId, account._id, secondEmail);

    // Remover segundo email
    const updatedAccount = await accountService.removeEmail(
      tenantId,
      account._id,
      secondEmail
    );

    expect(updatedAccount.emails.length).toBe(1);
    expect(updatedAccount.emails.some(e => e.email === secondEmail)).toBe(false);
  });
});