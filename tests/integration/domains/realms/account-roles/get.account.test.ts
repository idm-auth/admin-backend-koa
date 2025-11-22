import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { RoleBaseResponse } from '@/domains/realms/roles/role.schema';
import { AccountRoleBaseResponse } from '@/domains/realms/account-roles/account-role.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/realm/:tenantId/account-roles/account/:accountId', () => {
  let tenantId: string;
  let accountId: string;
  let roleId1: string;
  let roleId2: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-roles-get-account');

    // Create account
    const accountResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: generateTestEmail('test'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production,
      })
      .expect(201);
    const account: AccountBaseResponse = accountResponse.body;
    accountId = account._id;

    // Create roles
    const role1Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send({
        name: `test-role-1-${uuidv4()}`,
        description: 'Test role 1',
      })
      .expect(201);
    const role1: RoleBaseResponse = role1Response.body;
    roleId1 = role1._id;

    const role2Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send({
        name: `test-role-2-${uuidv4()}`,
        description: 'Test role 2',
      })
      .expect(201);
    const role2: RoleBaseResponse = role2Response.body;
    roleId2 = role2._id;

    // Create relationships
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-roles`)
      .send({
        accountId,
        roleId: roleId1,
      })
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-roles`)
      .send({
        accountId,
        roleId: roleId2,
      })
      .expect(201);
  });

  it('should get roles for account successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-roles/account/${accountId}`)
      .expect(200);

    const accountRoles: AccountRoleBaseResponse[] = response.body;
    expect(Array.isArray(accountRoles)).toBe(true);
    expect(accountRoles).toHaveLength(2);

    const roleIds = accountRoles.map((item) => item.roleId);
    expect(roleIds).toContain(roleId1);
    expect(roleIds).toContain(roleId2);

    accountRoles.forEach((item) => {
      expect(item.accountId).toBe(accountId);
      expect(item).toHaveProperty('_id');
      expect(item).toHaveProperty('createdAt');
      expect(item).toHaveProperty('updatedAt');
    });
  });

  it('should return empty array for account with no roles', async () => {
    // Create new account without roles
    const newAccountBaseResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: generateTestEmail('no-roles'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production,
      })
      .expect(201);
    const newAccount: AccountBaseResponse = newAccountBaseResponse.body;

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-roles/account/${newAccount._id}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  it('should return 400 for invalid accountId format', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-roles/account/invalid-id`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
