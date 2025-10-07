import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as accountService from '@/services/v1/account.service';
import * as groupService from '@/services/v1/group.service';

describe('POST /api/realm/:tenantId/v1/account-groups', () => {
  let tenantId: string;
  let accountId: string;
  let groupId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-groups');

    // Criar account e group para teste
    const account = await accountService.create(tenantId, {
      email: 'test@example.com',
      password: 'Password123!',
    });
    accountId = account._id.toString();

    const group = await groupService.create(tenantId, {
      name: 'Test Group',
      description: 'A test group',
    });
    groupId = group._id.toString();
  });

  it('should add account to group successfully', async () => {
    const relationData = {
      accountId,
      groupId,
      roles: [],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/account-groups`)
      .send(relationData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.accountId).toBe(accountId);
    expect(response.body.groupId).toBe(groupId);
    expect(response.body.roles).toEqual([]);
  });

  it('should return 400 for missing accountId', async () => {
    const relationData = {
      groupId,
      role: 'member',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/account-groups`)
      .send(relationData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
  });
});