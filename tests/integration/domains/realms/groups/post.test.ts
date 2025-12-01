import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { expectValidationError } from '@test/utils/validation-helpers';
import { GroupCreateResponse } from '@/domains/realms/groups/group.schema';

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
    await expectValidationError(
      `/api/realm/${tenantId}/groups`,
      { description: 'Group without name' },
      'Name is required',
      authToken
    );
  });

  it('should return 400 for invalid name characters', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/groups`,
      { name: 'Invalid<>Name', description: 'Test description' },
      'Name contains invalid characters',
      authToken
    );
  });

  it('should return 400 for name too long', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/groups`,
      { name: 'A'.repeat(101), description: 'Test description' },
      'Name must be at most 100 characters',
      authToken
    );
  });

  it('should return 400 for invalid description characters', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/groups`,
      {
        name: 'Valid Name',
        description: 'Invalid<script>alert("xss")</script>description',
      },
      'Description contains invalid characters',
      authToken
    );
  });

  it('should return 400 for description too long', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/groups`,
      { name: 'Valid Name', description: 'A'.repeat(501) },
      'Description must be at most 500 characters',
      authToken
    );
  });
});
