import { describe, expect, it } from 'vitest';
import { Context } from 'koa';
import * as accountController from '@/domains/realms/accounts/v1/account.controller';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.controller.findAllPaginated', () => {
  it('should handle findAllPaginated successfully', async () => {
    const tenantId = await getTenantId('test-controller-paginated');
    
    // Criar conta para teste
    await accountService.create(tenantId, {
      email: `controller-test-${uuidv4()}@example.com`,
      password: 'Password123!',
    });

    const ctx = {
      validated: {
        params: { tenantId },
        query: { page: 1, limit: 10 },
      },
      body: null,
    } as unknown as Context;

    await accountController.findAllPaginated(ctx);

    expect(ctx.body).toHaveProperty('data');
    expect(ctx.body).toHaveProperty('pagination');
    expect(Array.isArray(ctx.body.data)).toBe(true);
    expect(ctx.body.data.length).toBeGreaterThanOrEqual(1);
  });
});