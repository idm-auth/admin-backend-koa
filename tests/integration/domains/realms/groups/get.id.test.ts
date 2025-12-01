import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as groupService from '@/domains/realms/groups/group.service';
import { GroupBaseResponse } from '@/domains/realms/groups/group.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/realm/:tenantId/groups/:id', () => {
  let tenantId: string;
  let createdGroupId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-group-get-id');
    authToken = await getAuthToken(tenantId, 'groups.get.id.test');

    // Criar um grupo para os testes usando service
    const group = await groupService.create(tenantId, {
      name: 'Find Test Group',
      description: 'Group for find by ID tests',
    });
    createdGroupId = group._id;
  });

  it('should find group by id successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/groups/${createdGroupId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const groupResponse: GroupBaseResponse = response.body;
    expect(groupResponse).toHaveProperty('_id', createdGroupId);
    expect(groupResponse).toHaveProperty('name', 'Find Test Group');
    expect(groupResponse).toHaveProperty(
      'description',
      'Group for find by ID tests'
    );
  });

  it('should return 404 for non-existent group', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/groups/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Group not found');
  });

  it('should return 400 for invalid group id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/groups/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
