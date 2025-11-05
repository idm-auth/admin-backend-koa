import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.addEmail edge cases', () => {
  it('should throw NotFoundError when trying to add email that already exists in account', async () => {
    const tenantId = await getTenantId('test-add-existing-email');
    
    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `main-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    const existingEmail = account.emails[0].email;

    // Tentar adicionar email que já existe na conta
    await expect(
      accountService.addEmail(tenantId, account._id, existingEmail)
    ).rejects.toThrow('Email already exists');
  });
});