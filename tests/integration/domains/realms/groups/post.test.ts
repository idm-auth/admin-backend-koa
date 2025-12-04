import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { GroupCreateResponse } from '@/domains/realms/groups/group.schema';
import { ValidationErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/groups', () => {
  let tenantId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-group-post');
    authToken = await getAuthToken(tenantId, 'groups.post.test');
  });

  it('should create a new group successfully', async () => {
    const groupData = {
      name: 'Test Group',
      description: 'Test group description',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(groupData)
      .expect(201);

    const group: GroupCreateResponse = response.body;

    expect(group).toHaveProperty('_id');
    expect(group.name).toBe(groupData.name);
    expect(group.description).toBe(groupData.description);
  });

  it('should create group with only name (description optional)', async () => {
    const groupData = {
      name: 'Minimal Group',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(groupData)
      .expect(201);

    const group: GroupCreateResponse = response.body;

    expect(group).toHaveProperty('_id');
    expect(group.name).toBe(groupData.name);
  });

  it('should return 400 for missing name', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ description: 'Group without name' })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) => f.message.includes('Name is required'))
    ).toBe(true);
  });

  it('should return 400 for invalid name characters', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: 'Invalid<>Name', description: 'Test description' })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('Name contains invalid characters')
      )
    ).toBe(true);
  });

  it('should return 400 for name too long', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: 'A'.repeat(101), description: 'Test description' })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('Name must be at most 100 characters')
      )
    ).toBe(true);
  });

  it('should return 400 for invalid description characters', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        name: 'Valid Name',
        description: 'Invalid<script>alert("xss")</script>description',
      })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('Description contains invalid characters')
      )
    ).toBe(true);
  });

  it('should return 400 for description too long', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: 'Valid Name', description: 'A'.repeat(501) })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('Description must be at most 500 characters')
      )
    ).toBe(true);
  });
});
