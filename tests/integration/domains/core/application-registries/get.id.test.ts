import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { ApplicationRegistry } from '@/domains/core/application-registries/application-registry.model';
import { ApplicationRegistryReadResponse } from '@/domains/core/application-registries/application-registry.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/core/application-registries/:id', () => {
  let createdRegistryId: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const registryData = {
      applicationKey: `test-app-key-${uuidv4()}`,
      tenantId: 'test-tenant-id',
      applicationId: 'test-app-id',
    };

    const registry: ApplicationRegistry =
      await applicationRegistryService.create(registryData);
    createdRegistryId = registry._id;
  });

  it('should find registry by valid ID', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/${createdRegistryId}`)
      .expect(200);

    const registryResponse: ApplicationRegistryReadResponse = response.body;

    expect(registryResponse).toHaveProperty('_id', createdRegistryId);
    expect(registryResponse).toHaveProperty('applicationKey');
    expect(registryResponse).toHaveProperty('tenantId', 'test-tenant-id');
    expect(registryResponse).toHaveProperty('applicationId', 'test-app-id');
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/${nonExistentId}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';

    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/${invalidId}`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
