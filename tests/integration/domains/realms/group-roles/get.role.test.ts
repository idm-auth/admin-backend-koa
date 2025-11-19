import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as groupService from '@/domains/realms/groups/group.service';
import * as roleService from '@/domains/realms/roles/role.service';
import { GroupRoleBaseResponse } from '@/domains/realms/group-roles/group-role.schema';

describe('GET /api/realm/:tenantId/group-roles/role/:roleId', () => {
  let tenantId: string;
  let groupId1: string;
  let groupId2: string;
  let roleId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-group-roles-get-role');

    const group1 = await groupService.create(tenantId, {
      name: 'Test Group Role 1',
      description: 'A test group for role 1',
    });
    groupId1 = group1._id.toString();

    const group2 = await groupService.create(tenantId, {
      name: 'Test Group Role 2',
      description: 'A test group for role 2',
    });
    groupId2 = group2._id.toString();

    const role = await roleService.create(tenantId, {
      name: 'Test Role Groups',
      description: 'A test role for groups',
    });
    roleId = role._id.toString();

    // Add role to multiple groups
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-roles`)
      .send({ groupId: groupId1, roleId });

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-roles`)
      .send({ groupId: groupId2, roleId });
  });

  it('should get role groups successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/group-roles/role/${roleId}`)
      .expect(200);

    const roleGroups: GroupRoleBaseResponse[] = response.body;
    expect(Array.isArray(roleGroups)).toBe(true);
    expect(roleGroups).toHaveLength(2);
    expect(roleGroups[0]).toHaveProperty('_id');
    expect(roleGroups[0]).toHaveProperty('roleId', roleId);
    expect(roleGroups[0]).toHaveProperty('groupId');
  });
});
