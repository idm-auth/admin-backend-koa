import { AccountGroupBaseResponse } from '@/domains/realms/account-groups/account-group.schema';
import { AccountDocument } from '@/domains/realms/accounts/account.model';
import * as accountService from '@/domains/realms/accounts/account.service';
import { GroupDocument } from '@/domains/realms/groups/group.model';
import * as groupService from '@/domains/realms/groups/group.service';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { TEST_PASSWORD, generateTestEmail } from '@test/utils/test-constants';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { beforeAll, describe, expect, it } from 'vitest';

describe('GET /api/realm/:tenantId/account-groups/group/:groupId', () => {
  let tenantId: string;
  let accountId1: string;
  let accountId2: string;
  let groupId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-groups-get-group');
    authToken = await getAuthToken(tenantId, 'account-groups.get.group.test');

    // Create test accounts using service
    const account1: AccountDocument = await accountService.create(tenantId, {
      email: generateTestEmail('test-1', uuidv4()), // Test email - not production
      password: TEST_PASSWORD, // Test credential - not production
    });
    accountId1 = account1._id.toString();

    const account2: AccountDocument = await accountService.create(tenantId, {
      email: generateTestEmail('test-2', uuidv4()), // Test email - not production
      password: TEST_PASSWORD, // Test credential - not production
    });
    accountId2 = account2._id.toString();

    // Create test group using service
    const group: GroupDocument = await groupService.create(tenantId, {
      name: `test-group-${uuidv4()}`,
      description: 'Test group',
    });
    groupId = group._id.toString();

    // Create relationships
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        accountId: accountId1,
        groupId,
      });

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        accountId: accountId2,
        groupId,
      });
  });

  it('should get group accounts successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-groups/group/${groupId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const accountGroups: AccountGroupBaseResponse[] = response.body;

    expect(Array.isArray(accountGroups)).toBe(true);
    expect(accountGroups).toHaveLength(2);

    const account1Relation = accountGroups.find(
      (ag) => ag.accountId === accountId1
    );
    const account2Relation = accountGroups.find(
      (ag) => ag.accountId === accountId2
    );

    expect(account1Relation).toBeDefined();
    expect(account1Relation?.groupId).toBe(groupId);

    expect(account2Relation).toBeDefined();
    expect(account2Relation?.groupId).toBe(groupId);
  });

  it('should return empty array for group with no accounts', async () => {
    // Create new group using service
    const newGroup: GroupDocument = await groupService.create(tenantId, {
      name: `test-group-empty-${uuidv4()}`,
      description: 'Empty test group',
    });

    const response = await request(getApp().callback())
      .get(
        `/api/realm/${tenantId}/account-groups/group/${newGroup._id.toString()}`
      )
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  it('should return 400 for invalid groupId', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-groups/group/invalid-id`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
