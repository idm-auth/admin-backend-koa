import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('GET /api/realm/:tenantId/roles/:id', () => {
  let tenantId: string;
  let roleId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-roles-get-id');

    const roleData = {
      name: 'test-role',
      description: 'Test role for get by id',
      permissions: ['read'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send(roleData)
      .expect(201);

    roleId = response.body._id;
  });

  it('should get role by id successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/roles/${roleId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', roleId);
    expect(response.body.name).toBe('test-role');
    expect(response.body.description).toBe('Test role for get by id');
    expect(response.body.permissions).toEqual(['read']);
  });

  it('should return 404 for non-existent role', async () => {
    const nonExistentId = uuidv4();
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/roles/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid id format', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/roles/invalid-id`)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
