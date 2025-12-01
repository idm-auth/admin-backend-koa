import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as groupService from '@/domains/realms/groups/group.service';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('DELETE /api/realm/:tenantId/account-groups', () => {
  let tenantId: string;
  let accountId: string;
  let groupId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-groups-delete');
    authToken = await getAuthToken(tenantId, 'account-groups.delete.test');

    // Create test account using service
    const account = await accountService.create(tenantId, {
      email: generateTestEmail('test'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
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
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        accountId,
        groupId,
        roles: ['member'],
      })
      .expect(201);

    // Then remove it
    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        accountId,
        groupId,
      })
      .expect(204);
  });

  it('should return 404 for non-existent relationship', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        accountId,
        groupId,
      })
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
    expect(errorResponse.error).toContain('not found');
  });

  it('should return 400 for invalid accountId', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        accountId: 'invalid-id',
        groupId,
      })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing required fields', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        accountId,
      })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
