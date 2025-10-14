import { describe, it, expect, beforeAll } from 'vitest';
import { getTenantId } from '../../../../../utils/tenant.util';
import request from 'supertest';

describe('POST /api/realm/:tenantId/v1/authentication/login', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-auth');
  });

  it('should login successfully with valid credentials', async () => {
    // Primeiro criar uma conta para testar
    const createResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send({
        email: 'authtest@example.com',
        password: 'Password123!',
      });

    if (createResponse.status !== 201) {
      throw new Error('Failed to create test account');
    }

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/authentication/login`)
      .send({
        email: 'authtest@example.com',
        password: 'Password123!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('account');
    expect(response.body.account).toHaveProperty('id');
    expect(response.body.account).toHaveProperty('emails');
  });

  it('should return 404 for invalid credentials', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/authentication/login`)
      .send({
        email: 'nonexistent@example.com',
        password: 'WrongPassword123!',
      });

    expect(response.status).toBe(404);
  });

  it('should return 400 for validation errors', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/authentication/login`)
      .send({
        email: 'invalid-email',
        password: '',
      });

    expect(response.status).toBe(400);
  });
});
