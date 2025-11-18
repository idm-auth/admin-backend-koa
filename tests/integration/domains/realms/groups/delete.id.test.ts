import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as groupService from '@/domains/realms/groups/group.service';

describe('DELETE /api/realm/:tenantId/groups/:id', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-group-delete-id');
  });

  it('should delete group successfully', async () => {
    // Criar um grupo para deletar
    const group = await groupService.create(tenantId, {
      name: 'Group to Delete',
      description: 'This group will be deleted',
    });

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/groups/${group._id}`)
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 for non-existent group', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/groups/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Group not found');
  });

  it('should return 400 for invalid group id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/groups/${invalidId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 400 for invalid tenantId format', async () => {
    const invalidTenantId = 'invalid-tenant-id';
    const validGroupId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${invalidTenantId}/groups/${validGroupId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Invalid');
  });
});
