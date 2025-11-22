import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { RoleBaseResponse } from '@/domains/realms/roles/role.mapper';

describe('POST /api/realm/:tenantId/roles', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-roles-post');
  });

  it('should create role successfully', async () => {
    const roleData = {
      name: 'admin',
      description: 'Administrator role',
      permissions: ['read', 'write', 'delete'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send(roleData)
      .expect(201);

    const role: RoleBaseResponse = response.body;

    expect(role).toHaveProperty('_id');
    expect(role.name).toBe(roleData.name);
    expect(role.description).toBe(roleData.description);
    expect(role.permissions).toEqual(roleData.permissions);
    expect(role).toHaveProperty('createdAt');
    expect(role).toHaveProperty('updatedAt');
  });

  it('should return 400 for missing name', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send({
        description: 'Role without name',
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid permissions type', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send({
        name: 'test-role',
        permissions: 'invalid-type',
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
