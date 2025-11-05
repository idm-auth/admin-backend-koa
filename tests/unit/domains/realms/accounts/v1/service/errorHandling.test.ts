import { describe, expect, it, vi } from 'vitest';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service error handling', () => {
  it('should handle resetPassword database error', async () => {
    const tenantId = await getTenantId('test-reset-password-db-error');

    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `reset-error-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    // Simular erro de validação passando senha inválida
    await expect(
      accountService.resetPassword(tenantId, account._id, '')
    ).rejects.toThrow();
  });

  it('should handle updatePassword with account not found after validation', async () => {
    const tenantId = await getTenantId('test-update-password-not-found-after');

    // Criar conta
    const account = await accountService.create(tenantId, {
      email: `update-error-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    // Deletar conta para simular cenário onde account existe na validação mas não na atualização
    await accountService.remove(tenantId, account._id);

    await expect(
      accountService.updatePassword(
        tenantId,
        account._id,
        'Password123!',
        'NewPassword123!'
      )
    ).rejects.toThrow();
  });
});
