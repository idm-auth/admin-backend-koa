import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as accountService from '@/domains/realms/accounts/v1/account.service';

describe('POST /api/auth/v1/realm/:tenantId/login', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-auth-login');

    // Criar conta para teste de login
    await accountService.create(tenantId, {
      email: 'test@example.com',
      password: 'Password123!',
    });
  });

  it('should login successfully with valid credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const response = await request(getApp().callback())
      .post(`/api/auth/v1/realm/${tenantId}/login`)
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const loginData = {
      password: 'Password123!',
    };

    const response = await request(getApp().callback())
      .post(`/api/auth/v1/realm/${tenantId}/login`)
      .send(loginData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid request');
  });

  it('should return 400 for missing password', async () => {
    const loginData = {
      email: 'test@example.com',
    };

    const response = await request(getApp().callback())
      .post(`/api/auth/v1/realm/${tenantId}/login`)
      .send(loginData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid request');
  });

  it('should return 400 for invalid email format', async () => {
    const loginData = {
      email: 'invalid-email',
      password: 'Password123!',
    };

    const response = await request(getApp().callback())
      .post(`/api/auth/v1/realm/${tenantId}/login`)
      .send(loginData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid request');
  });

  it('should return 400 for empty password', async () => {
    const loginData = {
      email: 'test@example.com',
      password: '',
    };

    const response = await request(getApp().callback())
      .post(`/api/auth/v1/realm/${tenantId}/login`)
      .send(loginData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid request');
  });
});
