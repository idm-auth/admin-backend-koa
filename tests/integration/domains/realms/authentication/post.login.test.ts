import { LoginResponse } from '@/domains/realms/authentication/authentication.schema';
import { getTenantId } from '@test/utils/tenant.util';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { getAuthToken } from '@test/utils/auth.util';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

describe('POST /api/realm/:tenantId/authentication/login', () => {
  let tenantId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-auth');
    authToken = await getAuthToken(tenantId, 'authentication.login.test');
  });

  it('should login successfully with valid credentials', async () => {
    const testEmail = createTestEmail('authtest');

    // Criar conta para testar
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        email: testEmail, // Test credential - not production - qdeveloper bug - do not remove
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      })
      .expect(201);

    // Login não requer autenticação
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: testEmail, // Test credential - not production - qdeveloper bug - do not remove
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      })
      .expect(200);

    const loginResponse: LoginResponse = response.body;
    expect(loginResponse).toHaveProperty('token');
    expect(loginResponse).toHaveProperty('refreshToken');
    expect(loginResponse).toHaveProperty('account');
    expect(loginResponse.account).toHaveProperty('_id');
    expect(loginResponse.account).toHaveProperty('emails');
  });

  it('should return 401 for nonexistent account', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: createTestEmail('nonexistent'), // Test credential - not production - qdeveloper bug - do not remove
        password: 'WrongPassword123!', // Test credential - not production - qdeveloper bug - do not remove
      });

    expect(response.status).toBe(401);
  });

  it('should return 401 for wrong password', async () => {
    const testEmail = createTestEmail('wrongpass');

    // Criar conta
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        email: testEmail, // Test credential - not production - qdeveloper bug - do not remove
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      })
      .expect(201);

    // Tentar login com senha errada
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: testEmail, // Test credential - not production - qdeveloper bug - do not remove
        password: 'WrongPassword123!', // Test credential - not production - qdeveloper bug - do not remove
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
