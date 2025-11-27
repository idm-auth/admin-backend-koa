import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { expectValidationError } from '@test/utils/validation-helpers';
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
    await expectValidationError(
      `/api/realm/${tenantId}/roles`,
      { description: 'Role without name' },
      /Name is required|Required/
    );
  });

  it('should return 400 for invalid permissions type', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/roles`,
      { name: 'test-role', permissions: 'invalid-type' },
      /Expected array|Invalid/
    );
  });
});
