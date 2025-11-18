import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as groupService from '@/domains/realms/groups/group.service';

describe('DELETE /api/realm/:tenantId/account-groups', () => {
  let tenantId: string;
  let accountId: string;
  let groupId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-account-groups-delete');
    
    // Create test account using service
    const account = await accountService.create(tenantId, {
      email: `test-${uuidv4()}@example.com`,
      password: 'Password123!',
    });
    accountId = account._id.toString();

    // Create test group using service
    const group = await groupService.create(tenantId, {
      name: `test-group-${uuidv4()}`,
      description: 'Test group for account-groups',
    });
    groupId = group._id.toString();
  });

  it('should remove account from group successfully', async () => {
    // First create the relationship
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId,
        roles: ['member'],
      })
      .expect(201);

    // Then remove it
    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId,
      })
      .expect(204);
  });

  it('should return 404 for non-existent relationship', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId,
      })
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('not found');
  });

  it('should return 400 for invalid accountId', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId: 'invalid-id',
        groupId,
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for missing required fields', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});