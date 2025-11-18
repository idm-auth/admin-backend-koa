import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as groupService from '@/domains/realms/groups/group.service';

describe('PUT /api/realm/:tenantId/groups/:id', () => {
  let tenantId: string;
  let createdGroupId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-group-put-id');

    // Criar um grupo para os testes usando service
    const group = await groupService.create(tenantId, {
      name: 'Update Test Group',
      description: 'Group for update tests',
    });
    createdGroupId = group._id;
  });

  it('should update group successfully', async () => {
    const updateData = {
      name: 'Updated Group Name',
      description: 'Updated group description',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${createdGroupId}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdGroupId);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.description).toBe(updateData.description);
  });

  it('should update only name', async () => {
    const updateData = {
      name: 'Only Name Updated',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${createdGroupId}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdGroupId);
    expect(response.body.name).toBe(updateData.name);
  });

  it('should update only description', async () => {
    const updateData = {
      description: 'Only description updated',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${createdGroupId}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdGroupId);
    expect(response.body.description).toBe(updateData.description);
  });

  it('should return 404 for non-existent group', async () => {
    const nonExistentId = uuidv4();
    const updateData = {
      name: 'Updated Name',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${nonExistentId}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Group not found');
  });

  it('should return 400 for invalid group id format', async () => {
    const invalidId = 'invalid-id';
    const updateData = {
      name: 'Updated Name',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${invalidId}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 400 for invalid name characters', async () => {
    const updateData = {
      name: 'Invalid<>Name',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${createdGroupId}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty(
      'error',
      'Name contains invalid characters'
    );
  });

  it('should return 400 for name too long', async () => {
    const updateData = {
      name: 'A'.repeat(101), // Exceeds 100 character limit
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${createdGroupId}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty(
      'error',
      'Name must be at most 100 characters'
    );
  });

  it('should return 400 for invalid description characters', async () => {
    const updateData = {
      description: 'Invalid<script>alert("xss")</script>description',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${createdGroupId}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty(
      'error',
      'Description contains invalid characters'
    );
  });

  it('should return 400 for description too long', async () => {
    const updateData = {
      description: 'A'.repeat(501), // Exceeds 500 character limit
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/groups/${createdGroupId}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty(
      'error',
      'Description must be at most 500 characters'
    );
  });
});
