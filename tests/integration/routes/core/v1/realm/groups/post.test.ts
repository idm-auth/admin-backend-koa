import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('POST /api/core/v1/realm/:tenantId/groups', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-group-post');
  });

  it('should create a new group successfully', async () => {
    const groupData = {
      name: 'Test Group',
      description: 'A test group',
    };

    const response = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(groupData.name);
    expect(response.body.description).toBe(groupData.description);
  });

  it('should return 400 for missing name', async () => {
    const groupData = {
      description: 'A test group',
    };

    const response = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
  });
});