import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as groupService from '@/domains/realms/groups/group.service';

describe('GET /api/realm/:tenantId/groups/:id', () => {
  let tenantId: string;
  let createdGroupId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-group-get-id');

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
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdGroupId);
    expect(response.body).toHaveProperty('name', 'Find Test Group');
    expect(response.body).toHaveProperty('description', 'Group for find by ID tests');
  });

  it('should return 404 for non-existent group', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/groups/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Group not found');
  });

  it('should return 400 for invalid group id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/groups/${invalidId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });
});