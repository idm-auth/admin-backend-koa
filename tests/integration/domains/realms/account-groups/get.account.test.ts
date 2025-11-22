import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { TEST_PASSWORD, generateTestEmail } from '@test/utils/test-constants';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as groupService from '@/domains/realms/groups/group.service';
import { AccountGroupBaseResponse } from '@/domains/realms/account-groups/account-group.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/realm/:tenantId/account-groups/account/:accountId', () => {
  let tenantId: string;
  let accountId: string;
  let groupId1: string;
  let groupId2: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-groups-get-account');

    // Create test account using service
    const account = await accountService.create(tenantId, {
      email: generateTestEmail('test', uuidv4()), // Test email - not production
      password: TEST_PASSWORD, // Test credential - not production
    });
    accountId = account._id.toString();

    // Create test groups using service
    const group1 = await groupService.create(tenantId, {
      name: `test-group-1-${uuidv4()}`,
      description: 'Test group 1',
    });
    groupId1 = group1._id.toString();

    const group2 = await groupService.create(tenantId, {
      name: `test-group-2-${uuidv4()}`,
      description: 'Test group 2',
    });
    groupId2 = group2._id.toString();

    // Create relationships
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId: groupId1,
        roles: ['admin'],
      });

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId,
        groupId: groupId2,
        roles: ['member'],
      });
  });

  it('should get account groups successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-groups/account/${accountId}`)
      .expect(200);

    // Type safety com o schema definido
    const accountGroups: AccountGroupBaseResponse[] = response.body;

    expect(Array.isArray(accountGroups)).toBe(true);
    expect(accountGroups).toHaveLength(2);

    // Agora com type safety completo
    const group1Relation = accountGroups.find((ag) => ag.groupId === groupId1);
    const group2Relation = accountGroups.find((ag) => ag.groupId === groupId2);

    expect(group1Relation).toBeDefined();
    expect(group1Relation?.roles).toEqual(['admin']);

    expect(group2Relation).toBeDefined();
    expect(group2Relation?.roles).toEqual(['member']);
  });

  it('should return empty array for account with no groups', async () => {
    // Create new account using service
    const newAccount = await accountService.create(tenantId, {
      email: generateTestEmail('test', uuidv4()), // Test email - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    const response = await request(getApp().callback())
      .get(
        `/api/realm/${tenantId}/account-groups/account/${newAccount._id.toString()}`
      )
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  it('should return 400 for invalid accountId', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-groups/account/invalid-id`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
