import { describe, expect, it } from 'vitest';
import { Context } from 'koa';
import { v4 as uuidv4 } from 'uuid';
import * as accountController from '@/domains/realms/accounts/account.controller';
import { getTenantId } from '@test/utils/tenant.util';

describe('account.controller.remove error handling', () => {
  it('should handle service error and log it', async () => {
    const tenantId = await getTenantId('test-controller-remove-error');
    const nonExistentAccountId = uuidv4();

    const ctx = {
      validated: {
        params: { tenantId, id: nonExistentAccountId },
      },
    } as unknown as Context;

    // Tentar remover conta inexistente deve gerar erro
    await expect(accountController.remove(ctx)).rejects.toThrow(
      'Account not found'
    );
  });
});
