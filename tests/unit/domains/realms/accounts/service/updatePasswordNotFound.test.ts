import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/errors/not-found';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.updatePassword edge cases', () => {
  it('should throw NotFoundError when account is deleted between validation and update', async () => {
    const tenantId = await getTenantId('test-update-password-race-condition');

    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `race-${uuidv4()}@example.com`,
      password: 'CurrentPassword123!',
    });

    // Deletar conta para simular race condition
    await accountService.remove(tenantId, account._id);

    // Tentar atualizar senha de conta que não existe mais
    await expect(
      accountService.updatePassword(
        tenantId,
        account._id,
        'CurrentPassword123!',
        'NewPassword123!'
      )
    ).rejects.toThrow(NotFoundError);
  });
});
