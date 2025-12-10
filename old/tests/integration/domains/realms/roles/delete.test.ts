import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';

describe('DELETE /api/realm/:tenantId/roles/:id', () => {
  let tenantId: string;
  let roleId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-roles-delete');
    authToken = await getAuthToken(tenantId, 'roles.delete.test');

    const roleData = {
      name: 'role-to-delete',
      description: 'Role that will be deleted',
      permissions: ['read'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(roleData)
      .expect(201);

    roleId = response.body._id;
  });

  it('should delete role successfully', async () => {
    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/roles/${roleId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(204);

    // Verify role is deleted
    await request(getApp().callback())
      .get(`/api/realm/${tenantId}/roles/${roleId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(404);
  });

  it('should return 404 for non-existent role', async () => {
    const nonExistentId = uuidv4();
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/roles/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid id format', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/roles/invalid-id`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
