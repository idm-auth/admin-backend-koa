import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as roleService from '@/domains/realms/roles/role.service';
import { AccountPaginatedResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/realm/:tenantId/accounts - Paginated', () => {
  let tenantId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-account-paginated');
    authToken = await getAuthToken(tenantId, 'accounts.get.paginated.test');

    await accountService.create(tenantId, {
      email: generateTestEmail('paginated2'), // Test credential - not production - qdeveloper bug - do not remove
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    });
  });

  describe('Success scenarios', () => {
    it('should list all accounts successfully', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/accounts/`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const paginatedResponse: AccountPaginatedResponse = response.body;
      expect(paginatedResponse).toHaveProperty('data');
      expect(paginatedResponse).toHaveProperty('pagination');
      expect(Array.isArray(paginatedResponse.data)).toBe(true);
      expect(paginatedResponse.data.length).toBeGreaterThanOrEqual(2);

      // Verificar estrutura dos objetos retornados
      paginatedResponse.data.forEach((account) => {
        expect(account).toHaveProperty('_id');
        expect(account).toHaveProperty('emails');
        expect(Array.isArray(account.emails)).toBe(true);
        expect(account).not.toHaveProperty('password');
      });
    });

    it('should return empty array when no accounts exist', async () => {
      const emptyTenantId = await getTenantId(
        'vi-test-db-tenant-empty-accounts'
      );

      // Create a role in the empty tenant for assumeRole
      const role = await roleService.create(emptyTenantId, {
        name: 'test-role',
        description: 'Test role for assume role',
        permissions: [],
      });

      // Assume role to get token for empty tenant
      const assumeRoleResponse = await request(getApp().callback())
        .post(`/api/realm/${tenantId}/authentication/assume-role`)
        .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
        .send({
          targetRealmId: emptyTenantId,
          assumedRoleId: role._id,
        })
        .expect(200);

      const emptyToken = assumeRoleResponse.body.token; // Test credential - not production - qdeveloper bug - do not remove

      const response = await request(getApp().callback())
        .get(`/api/realm/${emptyTenantId}/accounts/`)
        .set('Authorization', `Bearer ${emptyToken}`) // Test credential - not production - qdeveloper bug - do not remove
        .expect(200);

      const paginatedResponse: AccountPaginatedResponse = response.body;
      expect(paginatedResponse).toHaveProperty('data');
      expect(Array.isArray(paginatedResponse.data)).toBe(true);
      expect(paginatedResponse.data.length).toBe(0);
    });
  });

  describe('Error scenarios', () => {
    it('should return 400 for invalid tenantId format', async () => {
      const invalidTenantId = 'invalid-tenant-id';

      const response = await request(getApp().callback())
        .get(`/api/realm/${invalidTenantId}/accounts`)
        .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
        .query({ page: 1, limit: 10 })
        .expect(400);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toContain('Invalid');
    });

    it('should return 400 for invalid pagination parameters', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/accounts`)
        .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
        .query({ page: -1, limit: 0 })
        .expect(400);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
    });

    it('should return 400 for limit exceeding maximum', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/accounts`)
        .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
        .query({ page: 1, limit: 1000 })
        .expect(400);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
    });
  });
});
