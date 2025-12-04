import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { RoleBaseResponse } from '@/domains/realms/roles/role.mapper';
import { ValidationErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/roles', () => {
  let tenantId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-roles-post');
    authToken = await getAuthToken(tenantId, 'roles.post.test');
  });

  it('should create role successfully', async () => {
    const roleData = {
      name: 'admin',
      description: 'Administrator role',
      permissions: ['read', 'write', 'delete'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
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
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ description: 'Role without name' })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some(
        (f) =>
          f.message.includes('Name is required') ||
          f.message.includes('Required')
      )
    ).toBe(true);
  });

  it('should return 400 for invalid permissions type', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: 'test-role', permissions: 'invalid-type' })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some(
        (f) =>
          f.message.includes('Expected array') || f.message.includes('Invalid')
      )
    ).toBe(true);
  });
});
