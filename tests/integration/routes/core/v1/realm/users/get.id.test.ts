import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('GET /api/core/v1/realm/:tenantId/users/:id', () => {
  let tenantId: string;
  let createdUserId: string;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-user-get-id');

    // Criar um usuário para os testes
    const userData = {
      email: 'findtest@example.com',
      password: 'Password123!',
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
    const response = await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/${createdUserId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdUserId);
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should return 400 for invalid user id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/${invalidId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toContain('Invalid ID');
  });

  it('should return 404 when id parameter is missing', async () => {
    await request(getApp().callback())
      .get(`/api/core/v1/realm/${tenantId}/users/`)
      .expect(404);
  });
});
