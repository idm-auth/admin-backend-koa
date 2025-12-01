import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import * as groupService from '@/domains/realms/groups/group.service';
import * as roleService from '@/domains/realms/roles/role.service';
import { GroupRoleBaseResponse } from '@/domains/realms/group-roles/group-role.schema';

describe('GET /api/realm/:tenantId/group-roles/group/:groupId', () => {
  let tenantId: string;
  let groupId: string;
  let roleId1: string;
  let roleId2: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-group-roles-get-group');
    authToken = await getAuthToken(tenantId, 'group-roles.get.group.test');

    const group = await groupService.create(tenantId, {
      name: 'Test Group Get',
      description: 'A test group for get',
    });
    groupId = group._id.toString();

    const role1 = await roleService.create(tenantId, {
      name: 'Test Role Get 1',
      description: 'A test role for get 1',
    });
    roleId1 = role1._id.toString();

    const role2 = await roleService.create(tenantId, {
      name: 'Test Role Get 2',
      description: 'A test role for get 2',
    });
    roleId2 = role2._id.toString();

    // Add roles to group
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId, roleId: roleId1 });

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId, roleId: roleId2 });
  });

  it('should get group roles successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/group-roles/group/${groupId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const groupRoles: GroupRoleBaseResponse[] = response.body;
    expect(Array.isArray(groupRoles)).toBe(true);
    expect(groupRoles).toHaveLength(2);
    expect(groupRoles[0]).toHaveProperty('_id');
    expect(groupRoles[0]).toHaveProperty('groupId', groupId);
    expect(groupRoles[0]).toHaveProperty('roleId');
  });
});
