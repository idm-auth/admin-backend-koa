import { describe, expect, it, vi } from 'vitest';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import * as applicationRegistryModel from '@/domains/core/application-registries/application-registry.model';

describe('application-registry.service.create', () => {
  it('should rethrow non-MongoDB errors', async () => {
    const getModelSpy = vi.spyOn(applicationRegistryModel, 'getModel');
    getModelSpy.mockReturnValue({
      create: vi.fn().mockRejectedValue(new Error('Database connection failed')),
    } as unknown as ReturnType<typeof applicationRegistryModel.getModel>);

    await expect(
      applicationRegistryService.create({
        applicationKey: 'test-key',
        tenantId: 'test-tenant',
        applicationId: 'test-app',
      })
    ).rejects.toThrow('Database connection failed');

    vi.restoreAllMocks();
  });
});
