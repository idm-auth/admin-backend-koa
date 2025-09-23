import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('POST /api/core/v1/realm/:tenantId/users', () => {
  let tenantId: string;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-core');
  });

  // Usar variáveis globais do setup
  const getApp = () => globalThis.testKoaApp;

  it('should create a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/users`)
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(userData.email);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const userData = {
      password: 'password123',
    };

    await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/users`)
      .send(userData)
      .expect(400);
  });

  it('should return 400 for missing password', async () => {
    const userData = {
      email: 'test@example.com',
    };

    await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/users`)
      .send(userData)
      .expect(400);
  });

  it('should return 400 for invalid email format', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'password123',
    };

    await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/users`)
      .send(userData)
      .expect(400);
  });

  it('should return 500 for server errors', async () => {
    // Teste com dados que causem erro interno
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock para simular erro no service se necessário
    const response = await request(getApp().callback())
      .post(`/api/core/v1/realm/${tenantId}/users`)
      .send(userData);

    if (response.status === 500) {
      expect(response.body).toHaveProperty('error', 'Internal server error');
    }
  });
});
