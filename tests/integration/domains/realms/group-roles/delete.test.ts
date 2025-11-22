import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as groupService from '@/domains/realms/groups/group.service';
import * as roleService from '@/domains/realms/roles/role.service';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('DELETE /api/realm/:tenantId/group-roles', () => {
  let tenantId: string;
  let groupId: string;
  let roleId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-group-roles-delete');

    const group = await groupService.create(tenantId, {
      name: 'Test Group Delete',
      description: 'A test group for delete',
    });
    groupId = group._id.toString();

    const role = await roleService.create(tenantId, {
      name: 'Test Role Delete',
      description: 'A test role for delete',
    });
    roleId = role._id.toString();
  });

  it('should remove role from group successfully', async () => {
    // First add the role to group
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-roles`)
      .send({ groupId, roleId })
      .expect(201);

    // Then remove it
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/group-roles`)
      .send({ groupId, roleId })
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 when trying to remove non-existent relationship', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/group-roles`)
      .send({ groupId, roleId })
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
