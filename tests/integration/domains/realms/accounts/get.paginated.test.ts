import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as accountService from '@/domains/realms/accounts/account.service';

describe('GET /api/realm/:tenantId/accounts - Paginated', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-paginated');

    // Criar algumas contas para os testes usando service
    const accountsData = [
      { email: 'paginated1@example.com', password: TEST_PASSWORD },
      { email: 'paginated2@example.com', password: TEST_PASSWORD },
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

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);

      // Verificar estrutura dos objetos retornados
      response.body.data.forEach((account: { _id: string; email: string }) => {
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

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe('Error scenarios', () => {
    it('should return 400 for invalid tenantId format', async () => {
      const invalidTenantId = 'invalid-tenant-id';

      const response = await request(getApp().callback())
        .get(`/api/realm/${invalidTenantId}/accounts`)
        .query({ page: 1, limit: 10 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid');
    });

    it('should return 400 for invalid pagination parameters', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/accounts`)
        .query({ page: -1, limit: 0 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for limit exceeding maximum', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/accounts`)
        .query({ page: 1, limit: 1000 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});