import { describe, expect, it } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';

describe('realm.service findAllPaginated', () => {
  it('should handle pagination with filter and sort', async () => {
    // Criar realm para teste
    await realmService.create({
      name: 'test-realm-pagination',
      dbName: 'test-db-pagination',
      description: 'Test realm for pagination',
    });

    const result = await realmService.findAllPaginated({
      page: 1,
      limit: 10,
      filter: 'test-realm',
      sortBy: 'name',
      descending: false,
    });

    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
    expect(result.pagination.total).toBeGreaterThanOrEqual(1);
  });
});