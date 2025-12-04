import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { ApplicationRegistryReadResponse } from '@/domains/core/application-registries/application-registry.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import { getModel } from '@/domains/core/application-registries/application-registry.model';

describe('GET /api/core/application-registries/key/:applicationKey', () => {
  let createdApplicationKey: string;
  let coreTenantId: string;
  let authToken: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const coreDbName = 'vi-test-db-app-registry-get-key';
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreDbName);
    coreTenantId = await getTenantId(coreDbName);
    authToken = await getAuthToken(coreTenantId, 'app-registry.get.key.test');
    await getModel().createIndexes();

    createdApplicationKey = uuidv4();

    await applicationRegistryService.create({
      applicationKey: createdApplicationKey,
      tenantId: uuidv4(),
      applicationId: uuidv4(),
    });
  });

  it('should find registry by valid application key', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/key/${createdApplicationKey}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const registryResponse: ApplicationRegistryReadResponse = response.body;

    expect(registryResponse).toHaveProperty('_id');
    expect(registryResponse).toHaveProperty(
      'applicationKey',
      createdApplicationKey
    );
    expect(registryResponse).toHaveProperty('tenantId');
    expect(registryResponse).toHaveProperty('applicationId');
  });

  it('should return 404 for non-existent application key', async () => {
    const nonExistentKey = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/core/application-registries/key/${nonExistentKey}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
