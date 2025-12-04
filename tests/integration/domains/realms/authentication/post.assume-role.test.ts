import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as roleService from '@/domains/realms/roles/role.service';
import * as accountService from '@/domains/realms/accounts/account.service';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { v4 as uuidv4 } from 'uuid';

describe('POST /api/realm/:tenantId/auth/assume-role', () => {
  const getApp = () => globalThis.testKoaApp;
  let sourceTenantId: string;
  let targetTenantId: string;
  let roleId: string;
  let token: string;

  beforeAll(async () => {
    sourceTenantId = await getTenantId('vi-test-db-assume-role-source');

    await accountService.create(sourceTenantId, {
      email: createTestEmail('assume-role'),
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    });

    const loginResponse = await request(getApp().callback())
      .post(`/api/realm/${sourceTenantId}/authentication/login`)
      .send({
        email: createTestEmail('assume-role'),
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      });

    token = loginResponse.body.token; // Test credential - not production - qdeveloper bug - do not remove

    targetTenantId = await getTenantId('vi-test-db-assume-role-target');

    const role = await roleService.create(targetTenantId, {
      name: `test-role-${uuidv4()}`,
    });
    roleId = role._id;
  });

  it('should assume role successfully', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${sourceTenantId}/authentication/assume-role`)
      .set('Authorization', `Bearer ${token}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        targetRealmId: targetTenantId,
        assumedRoleId: roleId,
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('expiresIn');
    expect(typeof response.body.token).toBe('string');
    expect(typeof response.body.expiresIn).toBe('number');
  });
});
