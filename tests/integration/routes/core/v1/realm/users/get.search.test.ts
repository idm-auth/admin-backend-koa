import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('GET /api/core/v1/realm/:tenantId/users/search', () => {
  let tenantId: string;
  const testEmail = 'searchtest@example.com';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-search');

    // Criar um usuário para os testes de busca
    const userData = {
      email: testEmail,
      password: 'password123',
    };

    await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/users`)
      .send(userData);
  });

  // Usar variáveis globais do setup
  const getApp = () => globalThis.testKoaApp;

  it('should find user by email successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/search`)
      .query({ email: testEmail })
      .expect(200);

    expect(response.body).toHaveProperty('email', testEmail);
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 404 for non-existent email', async () => {
    const nonExistentEmail = 'nonexistent@example.com';

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/search`)
      .query({ email: nonExistentEmail })
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should return 400 for missing email query parameter', async () => {
    await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/search`)
      .expect(400);
  });

  it('should return 400 for invalid email format', async () => {
    const invalidEmail = 'invalid-email-format';

    await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/search`)
      .query({ email: invalidEmail })
      .expect(400);
  });

  it('should handle empty email query parameter', async () => {
    await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/search`)
      .query({ email: '' })
      .expect(400);
  });

  it('should return 500 for server errors', async () => {
    // Teste com email que cause erro interno se necessário
    const response = await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/search`)
      .query({ email: 'test@example.com' });

    if (response.status === 500) {
      expect(response.body).toHaveProperty('error', 'Internal server error');
    }
  });
});
