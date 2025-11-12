import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.addEmail not found scenarios', () => {
  it('should throw NotFoundError when account not found after validation', async () => {
    const tenantId = await getTenantId('test-add-email-not-found-after');

    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `add-email-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    // Deletar conta para simular race condition
    await accountService.remove(tenantId, account._id);

    // Tentar adicionar email em conta que não existe mais
    await expect(
      accountService.addEmail(
        tenantId,
        account._id,
        `new-${uuidv4()}@example.com`
      )
    ).rejects.toThrow(NotFoundError);
  });
});
