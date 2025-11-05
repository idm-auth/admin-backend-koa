import { describe, expect, it } from 'vitest';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.findAllPaginated', () => {
  it('should handle pagination with filter and custom sort', async () => {
    const tenantId = await getTenantId('test-paginated-filter-sort');
    
    // Criar contas para teste
    await accountService.create(tenantId, {
      email: `filter-test-${uuidv4()}@example.com`,
      password: 'Password123!',
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
    });

    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
  });
});