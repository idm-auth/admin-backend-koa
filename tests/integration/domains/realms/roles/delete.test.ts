import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('DELETE /api/realm/:tenantId/roles/:id', () => {
  let tenantId: string;
  let roleId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-roles-delete');

    const roleData = {
      name: 'role-to-delete',
      description: 'Role that will be deleted',
      permissions: ['read'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send(roleData)
      .expect(201);

    roleId = response.body._id;
  });

  it('should delete role successfully', async () => {
    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/roles/${roleId}`)
      .expect(204);

    // Verify role is deleted
    await request(getApp().callback())
      .get(`/api/realm/${tenantId}/roles/${roleId}`)
      .expect(404);
  });

  it('should return 404 for non-existent role', async () => {
    const nonExistentId = uuidv4();
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/roles/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid id format', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/roles/invalid-id`)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
