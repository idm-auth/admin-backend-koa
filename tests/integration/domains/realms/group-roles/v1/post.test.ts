import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as groupService from '@/domains/realms/groups/v1/group.service';
import * as roleService from '@/domains/realms/roles/v1/role.service';

describe('POST /api/realm/:tenantId/v1/group-roles', () => {
  let tenantId: string;
  let groupId: string;
  let roleId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-group-roles');

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
      .post(`/api/realm/${tenantId}/v1/group-roles`)
      .send(relationData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.groupId).toBe(groupId);
    expect(response.body.roleId).toBe(roleId);
  });

  it('should return 400 for missing groupId', async () => {
    const relationData = {
      roleId,
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/group-roles`)
      .send(relationData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
  });
});
