import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as groupService from '@/domains/realms/groups/group.service';

describe('GET /api/realm/:tenantId/account-groups/group/:groupId', () => {
  let tenantId: string;
  let accountId1: string;
  let accountId2: string;
  let groupId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-account-groups-get-group');
    
    // Create test accounts using service
    const account1 = await accountService.create(tenantId, {
      email: `test-1-${uuidv4()}@example.com`,
      password: 'Password123!',
    });
    accountId1 = account1._id.toString();

    const account2 = await accountService.create(tenantId, {
      email: `test-2-${uuidv4()}@example.com`,
      password: 'Password123!',
    });
    accountId2 = account2._id.toString();

    // Create test group using service
    const group = await groupService.create(tenantId, {
      name: `test-group-${uuidv4()}`,
      description: 'Test group',
    });
    groupId = group._id.toString();

    // Create relationships
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId: accountId1,
        groupId,
        roles: ['admin'],
      });

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-groups`)
      .send({
        accountId: accountId2,
        groupId,
        roles: ['member'],
      });
  });

  it('should get group accounts successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-groups/group/${groupId}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    
    const account1Relation = response.body.find((ag: any) => ag.accountId === accountId1);
    const account2Relation = response.body.find((ag: any) => ag.accountId === accountId2);
    
    expect(account1Relation).toBeDefined();
    expect(account1Relation.roles).toEqual(['admin']);
    
    expect(account2Relation).toBeDefined();
    expect(account2Relation.roles).toEqual(['member']);
  });

  it('should return empty array for group with no accounts', async () => {
    // Create new group using service
    const newGroup = await groupService.create(tenantId, {
      name: `test-group-empty-${uuidv4()}`,
      description: 'Empty test group',
    });

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-groups/group/${newGroup._id.toString()}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  it('should return 400 for invalid groupId', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-groups/group/invalid-id`)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});