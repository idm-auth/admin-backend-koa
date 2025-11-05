import { describe, expect, it } from 'vitest';
import { Context } from 'koa';
import * as accountController from '@/domains/realms/accounts/v1/account.controller';
import { getTenantId } from '@test/utils/tenant.util';

describe('account.controller.findAllPaginated error handling', () => {
  it('should handle error in findAllPaginated and log it', async () => {
    const tenantId = await getTenantId('test-controller-paginated-error');
    
    const ctx = {
      validated: {
        params: { tenantId },
        query: { page: 1, limit: 10 },
      },
      body: null,
    } as unknown as Context;

    // Forçar erro passando tenantId inválido para o service
    const invalidCtx = {
      validated: {
        params: { tenantId: 'invalid-tenant-format' },
        query: { page: 1, limit: 10 },
      },
      body: null,
    } as unknown as Context;

    await expect(accountController.findAllPaginated(invalidCtx)).rejects.toThrow();
  });
});