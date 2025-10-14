import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('GET /api/realm/:tenantId/v1/accounts', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-findall');

    // Criar algumas contas para os testes
    const accountsData = [
      {
        email: 'findall1@example.com',
        password: TEST_PASSWORD,
      },
      {
        email: 'findall2@example.com',
        password: TEST_PASSWORD,
      },
    ];

    for (const accountData of accountsData) {
      const createResponse = await request(getApp().callback())
        .post(`/api/realm/${tenantId}/v1/accounts`)
        .send(accountData);

      if (createResponse.status !== 201) {
        throw new Error(
          `Failed to create test account: ${createResponse.status} - ${createResponse.body?.error || 'Unknown error'}`
        );
      }
    }
  });

  it('should list all accounts successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/v1/accounts/`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);

    // Verificar estrutura dos objetos retornados
    response.body.forEach((account: { id: string; email: string }) => {
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('email');
      expect(account).not.toHaveProperty('password');
    });
  });

  it('should return empty array when no accounts exist', async () => {
    const emptyTenantId = await getTenantId('test-tenant-empty-accounts');

    const response = await request(getApp().callback())
      .get(`/api/realm/${emptyTenantId}/v1/accounts/`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('should return 400 for invalid tenant id', async () => {
    const invalidTenantId = 'invalid-tenant-id';

    const response = await request(getApp().callback())
      .get(`/api/realm/${invalidTenantId}/v1/accounts/`)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
