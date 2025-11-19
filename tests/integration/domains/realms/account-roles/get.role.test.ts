import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { RoleBaseResponse } from '@/domains/realms/roles/role.schema';
import { AccountRoleBaseResponse } from '@/domains/realms/account-roles/account-role.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/realm/:tenantId/account-roles/role/:roleId', () => {
  let tenantId: string;
  let roleId: string;
  let accountId1: string;
  let accountId2: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-account-roles-get-role');

    // Create role
    const roleResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send({
        name: `test-role-${uuidv4()}`,
        description: 'Test role',
      })
      .expect(201);
    const role: RoleBaseResponse = roleResponse.body;
    roleId = role._id;

    // Create accounts
    const account1Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: generateTestEmail('test-1'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production,
      })
      .expect(201);
    const account1: AccountBaseResponse = account1Response.body;
    accountId1 = account1._id;

    const account2Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: generateTestEmail('test-2'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production,
      })
      .expect(201);
    const account2: AccountBaseResponse = account2Response.body;
    accountId2 = account2._id;

    // Create relationships
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-roles`)
      .send({
        accountId: accountId1,
        roleId,
      })
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-roles`)
      .send({
        accountId: accountId2,
        roleId,
      })
      .expect(201);
  });

  it('should get accounts with role successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-roles/role/${roleId}`)
      .expect(200);

    const accountRoles: AccountRoleBaseResponse[] = response.body;
    expect(Array.isArray(accountRoles)).toBe(true);
    expect(accountRoles).toHaveLength(2);

    const accountIds = accountRoles.map((item) => item.accountId);
    expect(accountIds).toContain(accountId1);
    expect(accountIds).toContain(accountId2);

    accountRoles.forEach((item) => {
      expect(item.roleId).toBe(roleId);
      expect(item).toHaveProperty('_id');
      expect(item).toHaveProperty('createdAt');
      expect(item).toHaveProperty('updatedAt');
    });
  });

  it('should return empty array for role with no accounts', async () => {
    // Create new role without accounts
    const newRoleBaseResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send({
        name: `no-accounts-${uuidv4()}`,
        description: 'Role with no accounts',
      })
      .expect(201);
    const newRole: RoleBaseResponse = newRoleBaseResponse.body;

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-roles/role/${newRole._id}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  it('should return 400 for invalid roleId format', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-roles/role/invalid-id`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
