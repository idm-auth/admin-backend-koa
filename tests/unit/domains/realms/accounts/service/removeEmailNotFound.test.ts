import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.removeEmail not found scenarios', () => {
  it('should throw NotFoundError when account not found after validation', async () => {
    const tenantId = await getTenantId('test-remove-email-not-found-after');

    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `remove-email-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    // Adicionar segundo email
    const secondEmail = `second-${uuidv4()}@example.com`;
    await accountService.addEmail(tenantId, account._id, secondEmail);

    // Deletar conta para simular race condition
    await accountService.remove(tenantId, account._id);

    // Tentar remover email de conta que não existe mais
    await expect(
      accountService.removeEmail(tenantId, account._id, secondEmail)
    ).rejects.toThrow(NotFoundError);
  });
});
