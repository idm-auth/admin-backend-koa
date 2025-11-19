import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it } from 'vitest';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';

describe('account.service.findAllPaginated', () => {
  it('should handle pagination with filter and custom sort', async () => {
    const tenantId = await getTenantId('test-paginated-filter-sort');

    // Criar contas para teste
    await accountService.create(tenantId, {
      email: generateTestEmail('filter-test'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production,
    });

    const result = await accountService.findAllPaginated(tenantId, {
      page: 1,
      limit: 10,
      filter: 'filter-test',
      sortBy: '_id',
      descending: true,
    });

    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
    expect(result.pagination.total).toBeGreaterThanOrEqual(1);
  });

  it('should handle pagination without filter and default sort', async () => {
    const tenantId = await getTenantId('test-paginated-no-filter');

    const result = await accountService.findAllPaginated(tenantId, {
      page: 1,
      limit: 5,
      descending: false,
    });

    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
  });

  it('should handle pagination with ascending sort', async () => {
    const tenantId = await getTenantId('test-paginated-ascending');

    const result = await accountService.findAllPaginated(tenantId, {
      page: 1,
      limit: 5,
      sortBy: '_id',
      descending: false,
    });

    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
  });

  it('should handle pagination with descending sort', async () => {
    const tenantId = await getTenantId('test-paginated-descending');

    const result = await accountService.findAllPaginated(tenantId, {
      page: 1,
      limit: 5,
      sortBy: '_id',
      descending: true,
    });

    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
  });
});
