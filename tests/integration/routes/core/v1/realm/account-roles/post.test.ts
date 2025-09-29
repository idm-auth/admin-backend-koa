import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as accountService from '@/services/v1/account.service';
import * as roleService from '@/services/v1/role.service';

describe('POST /api/core/v1/realm/:tenantId/account-roles', () => {
  let tenantId: string;
  let accountId: string;
  let roleId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-roles');

    const account = await accountService.create(tenantId, {
      email: 'test@example.com',
      password: 'Password123!',
    });
    accountId = account._id.toString();

    const role = await roleService.create(tenantId, {
      name: 'Test Role',
      description: 'A test role',
    });
    roleId = role._id.toString();
  });

  it('should add role to account successfully', async () => {
    const relationData = {
      accountId,
      roleId,
    };

    const response = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/account-roles`)
      .send(relationData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.accountId).toBe(accountId);
    expect(response.body.roleId).toBe(roleId);
  });

  it('should return 400 for missing accountId', async () => {
    const relationData = {
      roleId,
    };

    const response = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/account-roles`)
      .send(relationData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
  });
});