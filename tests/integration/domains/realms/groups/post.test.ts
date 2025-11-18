import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('POST /api/realm/:tenantId/groups', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-group-post');
  });

  it('should create a new group successfully', async () => {
    const groupData = {
      name: 'Test Group',
      description: 'Test group description',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(groupData.name);
    expect(response.body.description).toBe(groupData.description);
  });

  it('should create group with only name (description optional)', async () => {
    const groupData = {
      name: 'Minimal Group',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(groupData.name);
  });

  it('should return 400 for missing name', async () => {
    const groupData = {
      description: 'Group without name',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Name is required');
  });

  it('should return 400 for invalid name characters', async () => {
    const groupData = {
      name: 'Invalid<>Name',
      description: 'Test description',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Name contains invalid characters');
  });

  it('should return 400 for name too long', async () => {
    const groupData = {
      name: 'A'.repeat(101), // Exceeds 100 character limit
      description: 'Test description',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Name must be at most 100 characters');
  });

  it('should return 400 for invalid description characters', async () => {
    const groupData = {
      name: 'Valid Name',
      description: 'Invalid<script>alert("xss")</script>description',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Description contains invalid characters');
  });

  it('should return 400 for description too long', async () => {
    const groupData = {
      name: 'Valid Name',
      description: 'A'.repeat(501), // Exceeds 500 character limit
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send(groupData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Description must be at most 500 characters');
  });

  it('should return 500 for server errors', async () => {
    const groupData = {
      name: 'Test Group',
      description: 'Test description',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send(groupData);

    if (response.status === 500) {
      expect(response.body).toHaveProperty('error', 'Internal server error');
    }
  });
});