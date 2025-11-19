import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as groupService from '@/domains/realms/groups/group.service';
import { AccountGroupBaseResponse } from '@/domains/realms/account-groups/account-group.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/account-groups', () => {
  let tenantId: string;
  let accountId: string;
  let groupId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-account-groups-post');

    // Create test account using service
    // amazonq-ignore-next-line
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

  it('should create account-group relationship successfully', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId,
        roles: ['member'],
      })
      .expect(201);

    const accountGroupBaseResponse: AccountGroupBaseResponse = response.body;
    expect(accountGroupBaseResponse).toHaveProperty('_id');
    expect(accountGroupBaseResponse.accountId).toBe(accountId);
    expect(accountGroupBaseResponse.groupId).toBe(groupId);
    expect(accountGroupBaseResponse.roles).toEqual(['member']);
    expect(accountGroupBaseResponse).toHaveProperty('createdAt');
    expect(accountGroupBaseResponse).toHaveProperty('updatedAt');
  });

  it('should create account-group relationship without roles', async () => {
    const newAccount = await accountService.create(tenantId, {
      email: generateTestEmail('test'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId: newAccount._id.toString(),
        groupId,
      })
      .expect(201);

    const accountGroupBaseResponse: AccountGroupBaseResponse = response.body;
    expect(accountGroupBaseResponse).toHaveProperty('_id');
    expect(accountGroupBaseResponse.accountId).toBe(newAccount._id.toString());
    expect(accountGroupBaseResponse.groupId).toBe(groupId);
  });

  it('should return 400 for invalid accountId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
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
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
      })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
