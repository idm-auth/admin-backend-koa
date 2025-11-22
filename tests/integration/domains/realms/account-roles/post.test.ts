import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { RoleBaseResponse } from '@/domains/realms/roles/role.schema';
import { AccountRoleBaseResponse } from '@/domains/realms/account-roles/account-role.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/account-roles', () => {
  let tenantId: string;
  let accountId: string;
  let roleId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-roles-post');

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
  });

  it('should create account-role relationship successfully', async () => {
    const relationshipData = {
      accountId,
      roleId,
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-roles`)
      .send(relationshipData)
      .expect(201);

    const accountRole: AccountRoleBaseResponse = response.body;

    expect(accountRole).toHaveProperty('_id');
    expect(accountRole.accountId).toBe(accountId);
    expect(accountRole.roleId).toBe(roleId);
    expect(accountRole).toHaveProperty('createdAt');
    expect(accountRole).toHaveProperty('updatedAt');
  });

  it('should return 400 for missing accountId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-roles`)
      .send({
        roleId,
      })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing roleId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-roles`)
      .send({
        accountId,
      })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid accountId format', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-roles`)
      .send({
        accountId: 'invalid-id',
        roleId,
      })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
