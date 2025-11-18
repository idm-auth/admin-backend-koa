import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('PUT /api/realm/:tenantId/roles/:id', () => {
  let tenantId: string;
  let roleId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-roles-put');

    const roleData = {
      name: 'original-role',
      description: 'Original description',
      permissions: ['read'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send(roleData)
      .expect(201);

    roleId = response.body._id;
  });

  it('should update role successfully', async () => {
    const updateData = {
      name: 'updated-role',
      description: 'Updated description',
      permissions: ['read', 'write'],
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/roles/${roleId}`)
      .send(updateData)
      .expect(200);

    expect(response.body._id).toBe(roleId);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.description).toBe(updateData.description);
    expect(response.body.permissions).toEqual(updateData.permissions);
  });

  it('should update partial fields', async () => {
    const updateData = {
      description: 'Partially updated description',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/roles/${roleId}`)
      .send(updateData)
      .expect(200);

    expect(response.body._id).toBe(roleId);
    expect(response.body.description).toBe(updateData.description);
    expect(response.body.name).toBe('updated-role'); // Should keep previous value
  });

  it('should return 404 for non-existent role', async () => {
    const nonExistentId = uuidv4();
    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/roles/${nonExistentId}`)
      .send({ name: 'test' })
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });
});
