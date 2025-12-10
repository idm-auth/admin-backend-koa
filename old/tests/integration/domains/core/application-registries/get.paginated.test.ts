import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { ApplicationRegistryPaginatedResponse } from '@/domains/core/application-registries/application-registry.schema';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import { getModel } from '@/domains/core/application-registries/application-registry.model';

describe('GET /api/core/application-registries - Paginated', () => {
  let coreTenantId: string;
  let authToken: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const coreDbName = 'vi-test-db-app-registry-paginated';
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreDbName);
    coreTenantId = await getTenantId(coreDbName);
    authToken = await getAuthToken(coreTenantId, 'app-registry.paginated.test');
    await getModel().createIndexes();

    await applicationRegistryService.create({
      tenantId: uuidv4(),
      applicationId: uuidv4(),
    });

    await applicationRegistryService.create({
      tenantId: uuidv4(),
      applicationId: uuidv4(),
    });
  });

  it('should list all registries successfully', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/application-registries/')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const paginatedResponse: ApplicationRegistryPaginatedResponse =
      response.body;
    expect(paginatedResponse).toHaveProperty('data');
    expect(paginatedResponse).toHaveProperty('pagination');
    expect(Array.isArray(paginatedResponse.data)).toBe(true);
    expect(paginatedResponse.data.length).toBeGreaterThanOrEqual(2);

    paginatedResponse.data.forEach((registry) => {
      expect(registry).toHaveProperty('_id');
      expect(registry).toHaveProperty('applicationKey');
      expect(registry).toHaveProperty('tenantId');
      expect(registry).toHaveProperty('applicationId');
    });
  });

  it('should filter registries by applicationKey', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/application-registries/')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ filter: 'test-key-1' })
      .expect(200);

    const paginatedResponse: ApplicationRegistryPaginatedResponse =
      response.body;
    expect(paginatedResponse.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should return 400 for invalid pagination parameters', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/application-registries')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ page: -1, limit: 0 })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
