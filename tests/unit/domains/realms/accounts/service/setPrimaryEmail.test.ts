import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.setPrimaryEmail', () => {
  it('should throw NotFoundError when email does not exist in account', async () => {
    const tenantId = await getTenantId('test-set-primary-nonexistent');
    
    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `main-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    await expect(
      accountService.setPrimaryEmail(tenantId, account._id, 'nonexistent@example.com')
    ).rejects.toThrow(NotFoundError);
  });

  it('should set primary email successfully', async () => {
    const tenantId = await getTenantId('test-set-primary-success');
    
    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `main-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    // Adicionar segundo email
    const secondEmail = `second-${uuidv4()}@example.com`;
    await accountService.addEmail(tenantId, account._id, secondEmail);

    // Definir segundo email como primário
    const updatedAccount = await accountService.setPrimaryEmail(
      tenantId,
      account._id,
      secondEmail
    );

    const primaryEmail = updatedAccount.emails.find(e => e.isPrimary);
    expect(primaryEmail?.email).toBe(secondEmail);
    
    // Verificar que o email original não é mais primário
    const originalEmail = updatedAccount.emails.find(e => e.email === account.emails[0].email);
    expect(originalEmail?.isPrimary).toBe(false);
  });
});