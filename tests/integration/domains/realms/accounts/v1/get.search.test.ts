import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('GET /api/realm/:tenantId/v1/accounts/search', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-search');

    // Criar uma conta para os testes
    const accountData = {
      email: 'searchtest@example.com',
      // amazonq-ignore-next-line
      password: TEST_PASSWORD,
    };

    const createResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData);

    if (createResponse.status !== 201) {
      throw new Error(
        `Failed to create test account: ${createResponse.status} - ${createResponse.body?.error || 'Unknown error'}`
      );
    }
  });

  it('should find account by email successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/v1/accounts/search`)
      .query({ email: 'searchtest@example.com' })
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'searchtest@example.com');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for missing email parameter', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/v1/accounts/search`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/v1/accounts/search`)
      .query({ email: 'invalid-email' })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toContain('Invalid email format');
  });

  it('should return 404 for non-existent email', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/v1/accounts/search`)
      .query({ email: 'nonexistent@example.com' })
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });
});
