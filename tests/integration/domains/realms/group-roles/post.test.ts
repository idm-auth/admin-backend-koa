import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import * as groupService from '@/domains/realms/groups/group.service';
import * as roleService from '@/domains/realms/roles/role.service';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/group-roles', () => {
  let tenantId: string;
  let groupId: string;
  let roleId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-group-roles');
    authToken = await getAuthToken(tenantId, 'group-roles.post.test');

    const group = await groupService.create(tenantId, {
      name: 'Test Group',
      description: 'A test group',
    });
    groupId = group._id.toString();

    const role = await roleService.create(tenantId, {
      name: 'Test Role',
      description: 'A test role',
    });
    roleId = role._id.toString();
  });

  it('should add role to group successfully', async () => {
    const relationData = {
      groupId,
      roleId,
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(relationData)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.groupId).toBe(groupId);
    expect(response.body.roleId).toBe(roleId);
  });

  it('should return 400 for missing groupId', async () => {
    const relationData = {
      roleId,
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(relationData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
