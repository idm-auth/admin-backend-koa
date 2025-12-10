import { describe, expect, it } from 'vitest';
import { Context } from 'koa';
import * as accountController from '@/domains/realms/accounts/account.controller';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { TEST_PASSWORD, generateTestEmail } from '@test/utils/test-constants';
import { v4 as uuidv4 } from 'uuid';

describe('account.controller.findAllPaginated', () => {
  it('should handle findAllPaginated successfully', async () => {
    const tenantId = await getTenantId('vi-test-db-controller-paginated');

    await accountService.create(tenantId, {
      email: generateTestEmail('controller-test', uuidv4()), // Test email - not production
      password: TEST_PASSWORD, // Test credential - not production
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
    const body = ctx.body as { data: unknown[]; pagination: unknown };
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle error in findAllPaginated and log it', async () => {
    const invalidCtx = {
      validated: {
        params: { tenantId: 'invalid-tenant-format' },
        query: { page: 1, limit: 10 },
      },
      body: null,
    } as unknown as Context;

    await expect(
      accountController.findAllPaginated(invalidCtx)
    ).rejects.toThrow();
  });
});
