import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { ApplicationRegistry } from '@/domains/core/application-registries/application-registry.model';
import { ApplicationRegistryUpdateResponse } from '@/domains/core/application-registries/application-registry.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('PUT /api/core/application-registries/:id', () => {
  let createdRegistryId: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const registryData = {
      applicationKey: `test-app-key-${uuidv4()}`,
      tenantId: 'original-tenant',
      applicationId: 'original-app',
    };

    const registry: ApplicationRegistry =
      await applicationRegistryService.create(registryData);
    createdRegistryId = registry._id;
  });

  it('should update registry successfully', async () => {
    const updateData = {
      tenantId: 'updated-tenant',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/application-registries/${createdRegistryId}`)
      .send(updateData)
      .expect(200);

    const registryResponse: ApplicationRegistryUpdateResponse = response.body;
    expect(registryResponse).toHaveProperty('_id', createdRegistryId);
    expect(registryResponse).toHaveProperty('tenantId', 'updated-tenant');
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();
    const updateData = { tenantId: 'updated' };

    const response = await request(getApp().callback())
      .put(`/api/core/application-registries/${nonExistentId}`)
      .send(updateData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';
    const updateData = { tenantId: 'updated' };

    const response = await request(getApp().callback())
      .put(`/api/core/application-registries/${invalidId}`)
      .send(updateData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
