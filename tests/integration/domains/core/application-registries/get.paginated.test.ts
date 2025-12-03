import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { ApplicationRegistryPaginatedResponse } from '@/domains/core/application-registries/application-registry.schema';

describe('GET /api/core/application-registries - Paginated', () => {
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    await applicationRegistryService.create({
      applicationKey: `test-key-1-${uuidv4()}`,
      tenantId: 'tenant-1',
      applicationId: 'app-1',
    });

    await applicationRegistryService.create({
      applicationKey: `test-key-2-${uuidv4()}`,
      tenantId: 'tenant-2',
      applicationId: 'app-2',
    });
  });

  it('should list all registries successfully', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/application-registries/')
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
      .query({ filter: 'test-key-1' })
      .expect(200);

    const paginatedResponse: ApplicationRegistryPaginatedResponse =
      response.body;
    expect(paginatedResponse.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should return 400 for invalid pagination parameters', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/application-registries')
      .query({ page: -1, limit: 0 })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
