import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountPaginatedResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/realm/:tenantId/accounts - Paginated', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-paginated');

    // Criar algumas contas para os testes usando service
    const accountsData = [
      { email: generateTestEmail('paginated1'), password: TEST_PASSWORD }, // Test credential - not production
      { email: generateTestEmail('paginated2'), password: TEST_PASSWORD }, // Test credential - not production
    ];

    for (const accountData of accountsData) {
      await accountService.create(tenantId, accountData);
    }
  });

  describe('Success scenarios', () => {
    it('should list all accounts successfully', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/accounts/`)
        .expect(200);

      const paginatedResponse: AccountPaginatedResponse = response.body;
      expect(paginatedResponse).toHaveProperty('data');
      expect(paginatedResponse).toHaveProperty('pagination');
      expect(Array.isArray(paginatedResponse.data)).toBe(true);
      expect(paginatedResponse.data.length).toBeGreaterThanOrEqual(2);

      // Verificar estrutura dos objetos retornados
      paginatedResponse.data.forEach((account) => {
        expect(account).toHaveProperty('_id');
        expect(account).toHaveProperty('email');
        expect(account).not.toHaveProperty('password');
      });
    });

    it('should return empty array when no accounts exist', async () => {
      const emptyTenantId = await getTenantId('test-tenant-empty-accounts');

      const response = await request(getApp().callback())
        .get(`/api/realm/${emptyTenantId}/accounts/`)
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
        .query({ page: 1, limit: 10 })
        .expect(400);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toContain('Invalid');
    });

    it('should return 400 for invalid pagination parameters', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/accounts`)
        .query({ page: -1, limit: 0 })
        .expect(400);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
    });

    it('should return 400 for limit exceeding maximum', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/accounts`)
        .query({ page: 1, limit: 1000 })
        .expect(400);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
    });
  });
});
