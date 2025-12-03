import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { ApplicationRegistryReadResponse } from '@/domains/core/application-registries/application-registry.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/core/application-registries/key/:applicationKey', () => {
  let createdApplicationKey: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    createdApplicationKey = `test-app-key-${uuidv4()}`;

    await applicationRegistryService.create({
      applicationKey: createdApplicationKey,
      tenantId: 'test-tenant-id',
      applicationId: 'test-app-id',
    });
  });

  it('should find registry by valid application key', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/key/${createdApplicationKey}`)
      .expect(200);

    const registryResponse: ApplicationRegistryReadResponse = response.body;

    expect(registryResponse).toHaveProperty('_id');
    expect(registryResponse).toHaveProperty(
      'applicationKey',
      createdApplicationKey
    );
    expect(registryResponse).toHaveProperty('tenantId', 'test-tenant-id');
    expect(registryResponse).toHaveProperty('applicationId', 'test-app-id');
  });

  it('should return 404 for non-existent application key', async () => {
    const nonExistentKey = `non-existent-${uuidv4()}`;

    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/key/${nonExistentKey}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
