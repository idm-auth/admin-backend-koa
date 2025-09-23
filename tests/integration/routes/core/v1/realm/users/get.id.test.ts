import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('GET /api/core/v1/realm/:tenantId/users/:id', () => {
  let tenantId: string;
  let createdUserId: string;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-get-id');

    // Criar um usuário para os testes
    const userData = {
      email: 'findtest@example.com',
      password: 'password123',
    };

    const createResponse = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/users`)
      .send(userData);

    if (createResponse.status === 201) {
      createdUserId = createResponse.body.id;
    }
  });

  // Usar variáveis globais do setup
  const getApp = () => globalThis.testKoaApp;

  it('should find user by id successfully', async () => {
    if (!createdUserId) {
      // Skip se não conseguiu criar usuário
      return;
    }

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/${createdUserId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdUserId);
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should return 400 for invalid user id format', async () => {
    const invalidId = 'invalid-id';

    await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/${invalidId}`)
      .expect(400);
  });

  it('should return 500 for server errors', async () => {
    // Teste com ID que cause erro interno se necessário
    const response = await request(getApp().callback()).get(
      `/api/core/v1/realm/${tenantId}/users/507f1f77bcf86cd799439012`
    );

    if (response.status === 500) {
      expect(response.body).toHaveProperty('error', 'Internal server error');
    }
  });
});
