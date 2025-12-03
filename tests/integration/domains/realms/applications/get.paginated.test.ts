import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import * as applicationService from '@/domains/realms/applications/application.service';
import { ApplicationPaginatedResponse } from '@/domains/realms/applications/application.schema';

describe('GET /api/realm/:tenantId/applications - Paginated', () => {
  let tenantId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-application-paginated');
    authToken = await getAuthToken(tenantId, 'applications.get.paginated.test');

    await applicationService.create(tenantId, { name: 'App 1' });
    await applicationService.create(tenantId, { name: 'App 2' });
  });

  it('should list all applications successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/applications/`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const paginatedResponse: ApplicationPaginatedResponse = response.body;
    expect(paginatedResponse).toHaveProperty('data');
    expect(paginatedResponse).toHaveProperty('pagination');
    expect(Array.isArray(paginatedResponse.data)).toBe(true);
    expect(paginatedResponse.data.length).toBeGreaterThanOrEqual(2);

    paginatedResponse.data.forEach((application) => {
      expect(application).toHaveProperty('_id');
      expect(application).toHaveProperty('name');
      expect(application).toHaveProperty('applicationSecret');
    });
  });

  it('should filter applications by name', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/applications/`)
      .set('Authorization', `Bearer ${authToken}`)
      .query({ filter: 'App 1' })
      .expect(200);

    const paginatedResponse: ApplicationPaginatedResponse = response.body;
    expect(paginatedResponse.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should return 400 for invalid pagination parameters', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/applications`)
      .set('Authorization', `Bearer ${authToken}`)
      .query({ page: -1, limit: 0 })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
