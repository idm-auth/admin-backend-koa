import { RefreshTokenResponse } from '@/domains/realms/authentication/authentication.schema';
import { getTenantId } from '@test/utils/tenant.util';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { getAuthToken } from '@test/utils/auth.util';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

describe('POST /api/realm/:tenantId/authentication/refresh', () => {
  let tenantId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-auth-refresh');
    authToken = await getAuthToken(tenantId, 'authentication.refresh.test');
  });

  it('should refresh token successfully with valid refresh token', async () => {
    const testEmail = createTestEmail('refreshtest');

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        email: testEmail, // Test credential - not production - qdeveloper bug - do not remove
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      })
      .expect(201);

    const loginResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/login`)
      .send({
        email: testEmail, // Test credential - not production - qdeveloper bug - do not remove
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      })
      .expect(200);

    const { refreshToken } = loginResponse.body;
    expect(refreshToken).toBeDefined();

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/refresh`)
      .send({
        refreshToken, // Test credential - not production - qdeveloper bug - do not remove
      })
      .expect(200);

    const refreshResponse: RefreshTokenResponse = response.body;
    expect(refreshResponse).toHaveProperty('token');
    expect(refreshResponse).toHaveProperty('refreshToken');
    expect(refreshResponse.token).not.toBe(loginResponse.body.token);
    expect(refreshResponse.refreshToken).not.toBe(refreshToken);
  });

  it('should return 401 for invalid refresh token', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/refresh`)
      .send({
        refreshToken: 'invalid-token', // Test credential - not production - qdeveloper bug - do not remove
      });

    expect(response.status).toBe(401);
  });

  it('should return 400 for missing refresh token', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/authentication/refresh`)
      .send({});

    expect(response.status).toBe(400);
  });
});
