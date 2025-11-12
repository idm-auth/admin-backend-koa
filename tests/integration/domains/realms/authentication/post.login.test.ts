import { describe, it, expect, beforeAll } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import request from 'supertest';

describe('POST /api/realm/:tenantId/authentication/login', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-auth');
    console.log('TenantId for auth test:', tenantId);
  });

  it('should login successfully with valid credentials', async () => {
    // Primeiro criar uma conta para testar
    const createResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: 'authtest@example.com',
        password: 'Password123!',
      });

    if (createResponse.status !== 201) {
      throw new Error('Failed to create test account');
    }

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: 'authtest@example.com',
        password: 'Password123!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('account');
    expect(response.body.account).toHaveProperty('_id');
    expect(response.body.account).toHaveProperty('emails');
  });

  it('should return 404 for invalid credentials', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: 'nonexistent@example.com',
        password: 'WrongPassword123!',
      });

    expect(response.status).toBe(401);
  });

  it('should return 400 for validation errors', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: 'invalid-email',
        password: '',
      });

    expect(response.status).toBe(400);
  });
});
