import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('POST /api/core/v1/realm/:tenantId/roles', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-role-post');
  });

  it('should create a new role successfully', async () => {
    const roleData = {
      name: 'Test Role',
      description: 'A test role',
      permissions: ['read', 'write'],
    };

    const response = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/roles`)
      .send(roleData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(roleData.name);
    expect(response.body.description).toBe(roleData.description);
    expect(response.body.permissions).toEqual(roleData.permissions);
  });

  it('should return 400 for missing name', async () => {
    const roleData = {
      description: 'A test role',
    };

    const response = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/roles`)
      .send(roleData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
  });
});