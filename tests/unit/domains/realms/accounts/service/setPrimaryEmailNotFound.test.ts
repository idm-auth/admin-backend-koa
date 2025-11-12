import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.setPrimaryEmail edge cases', () => {
  it('should throw NotFoundError when account is deleted between validation and update', async () => {
    const tenantId = await getTenantId('test-set-primary-race-condition');

    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `primary-race-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    // Adicionar segundo email
    const secondEmail = `second-${uuidv4()}@example.com`;
    await accountService.addEmail(tenantId, account._id, secondEmail);

    // Deletar conta para simular race condition
    await accountService.remove(tenantId, account._id);

    // Tentar definir email primário em conta que não existe mais
    await expect(
      accountService.setPrimaryEmail(tenantId, account._id, secondEmail)
    ).rejects.toThrow(NotFoundError);
  });
});
