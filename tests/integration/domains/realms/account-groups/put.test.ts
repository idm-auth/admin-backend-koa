import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as groupService from '@/domains/realms/groups/group.service';
import { AccountGroupBaseResponse } from '@/domains/realms/account-groups/account-group.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('PUT /api/realm/:tenantId/account-groups', () => {
  let tenantId: string;
  let accountId: string;
  let groupId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-groups-put');

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

    // Create initial relationship
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId,
        roles: ['member'],
      });
  });

  it('should update account group roles successfully', async () => {
    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId,
        roles: ['admin', 'moderator'],
      })
      .expect(200);

    const accountGroupBaseResponse: AccountGroupBaseResponse = response.body;
    expect(accountGroupBaseResponse).toHaveProperty('_id');
    expect(accountGroupBaseResponse.accountId).toBe(accountId);
    expect(accountGroupBaseResponse.groupId).toBe(groupId);
    expect(accountGroupBaseResponse.roles).toEqual(['admin', 'moderator']);
    expect(accountGroupBaseResponse).toHaveProperty('updatedAt');
  });

  it('should update to empty roles array', async () => {
    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId,
        roles: [],
      })
      .expect(200);

    const accountGroupBaseResponse: AccountGroupBaseResponse = response.body;
    expect(accountGroupBaseResponse.roles).toEqual([]);
  });

  it('should return 404 for non-existent relationship', async () => {
    // Create new account that's not in the group
    const newAccount = await accountService.create(tenantId, {
      email: generateTestEmail('test-new'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId: newAccount._id.toString(),
        groupId,
        roles: ['member'],
      })
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
    expect(errorResponse.error).toContain('not found');
  });

  it('should return 400 for invalid accountId', async () => {
    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId: 'invalid-id',
        groupId,
        roles: ['member'],
      })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing required fields', async () => {
    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        roles: ['member'],
      })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
