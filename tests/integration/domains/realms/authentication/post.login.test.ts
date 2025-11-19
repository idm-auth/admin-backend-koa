import { LoginResponse } from '@/domains/realms/authentication/authentication.schema';
import { getTenantId } from '@test/utils/tenant.util';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

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
        email: createTestEmail('authtest'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production
      });

    if (createResponse.status !== 201) {
      throw new Error('Failed to create test account');
    }

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: createTestEmail('authtest'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production
      });

    expect(response.status).toBe(200);
    const loginResponse: LoginResponse = response.body;
    expect(loginResponse).toHaveProperty('token');
    expect(loginResponse).toHaveProperty('account');
    expect(loginResponse.account).toHaveProperty('_id');
    expect(loginResponse.account).toHaveProperty('emails');
  });

  it('should return 401 for nonexistent account', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: createTestEmail('nonexistent'), // Test credential - not production
        password: 'WrongPassword123!', // Test credential - not production
      });

    expect(response.status).toBe(401);
  });

  it('should return 401 for wrong password', async () => {
    // Create account first
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: createTestEmail('wrongpass'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production
      })
      .expect(201);

    // Try to login with wrong password
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: createTestEmail('wrongpass'), // Test credential - not production
        password: 'WrongPassword123!', // Test credential - not production
      });

    expect(response.status).toBe(401);
  });

  it('should return 400 for validation errors', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: 'invalid-email',
        // amazonq-ignore-next-line
        password: '',
      });

    expect(response.status).toBe(400);
  });
});
