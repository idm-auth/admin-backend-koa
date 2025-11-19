import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';
import * as realmsModel from '@/domains/core/realms/realm.model';

describe('realm.service findAllPaginated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should handle database error in pagination', async () => {
    const mockFind = vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi
            .fn()
            .mockRejectedValue(new Error('Database connection failed')),
        }),
      }),
    });

    const getModelSpy = vi.spyOn(realmsModel, 'getModel');
    getModelSpy.mockReturnValue({
      find: mockFind,
      countDocuments: vi.fn().mockResolvedValue(0),
    } as unknown as ReturnType<typeof realmsModel.getModel>);

    await expect(
      realmService.findAllPaginated({
        page: 1,
        limit: 10,
        descending: false,
      })
    ).rejects.toThrow('Failed to retrieve realms');
  });
});
