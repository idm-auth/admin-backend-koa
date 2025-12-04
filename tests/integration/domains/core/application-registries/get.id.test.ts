import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { ApplicationRegistry, getModel } from '@/domains/core/application-registries/application-registry.model';
import { ApplicationRegistryReadResponse } from '@/domains/core/application-registries/application-registry.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';

describe('GET /api/core/application-registries/:id', () => {
  let createdRegistryId: string;
  let coreTenantId: string;
  let authToken: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const coreDbName = 'vi-test-db-app-registry-get-id';
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreDbName);
    coreTenantId = await getTenantId(coreDbName);
    authToken = await getAuthToken(coreTenantId, 'app-registry.get.id.test');
    await getModel().createIndexes();

    const registryData = {
      applicationKey: uuidv4(),
      tenantId: uuidv4(),
      applicationId: uuidv4(),
    };

    const registry: ApplicationRegistry =
      await applicationRegistryService.create(registryData);
    createdRegistryId = registry._id;
  });

  it('should find registry by valid ID', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/${createdRegistryId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const registryResponse: ApplicationRegistryReadResponse = response.body;

    expect(registryResponse).toHaveProperty('_id', createdRegistryId);
    expect(registryResponse).toHaveProperty('applicationKey');
    expect(registryResponse).toHaveProperty('tenantId');
    expect(registryResponse).toHaveProperty('applicationId');
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';

    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
